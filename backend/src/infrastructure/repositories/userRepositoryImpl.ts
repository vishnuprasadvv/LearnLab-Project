import { format } from "path";
import { IUserRepository } from "../../application/repositories/IUserRepository";
import User, {IUser} from "../../domain/models/User";
import Courses from "../../domain/models/Courses";

export class UserRepositoryImpl implements IUserRepository {
    async findById(userId: string): Promise<IUser | null> {
        return User.findById(userId).select('-password')
    }

    async save(user: IUser): Promise<IUser> {
        return user.save();
    }

    async getAllUsersExcluded(userId:string): Promise<IUser[]> {
        return User.find({_id:{$ne: userId}  ,isVerified: true, status : 'active', role:{$ne:'admin'}}).select('-password -googleId -profileImagePublicId')
    }
    async getAllUsers():Promise<IUser[]> {
        return User.find()
    }

    async countAll(): Promise<number> {
        return User.countDocuments();
    }

    async countByStatus(status: string): Promise<number> {
        return User.countDocuments({status})
    }

    async countByRole(): Promise<{ student: number; instructor: number; admin: number; }> {
        const roles:{_id:string, count:number}[] = await User.aggregate([
            {$group: {_id: "$role", count:{ $sum: 1}}}
        ])
        const roleCounts = {student: 0, instructor:0, admin: 0};
        roles.forEach((role:{_id:string, count:number}) => {
            const key = role._id as 'student' | 'instructor' | 'admin'
            roleCounts[key] = role.count;
        })
        return roleCounts;
    }
    async getRegistrationsOverTime(timeFrame: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{ date: string; count: number; }[]> {
        const groupStage = {
            daily: {
                $dateToString: { format : "%Y-%m-%d", date: "$createdAt"},
            },
            weekly: {
                $dateToString: { format : "%Y-%U", date: "$createdAt"},
            },
            monthly: {
                $dateToString: { format : "%Y-%m", date: "$createdAt"},
            },
            yearly: {
                $dateToString: { format : "%Y", date: "$createdAt"},
            },
        }
        const results = await User.aggregate([
            {$group : { 
                _id: groupStage[timeFrame] ,
                 count: {$sum:1}}},
            { $sort : { _id: 1 }},
        ])
        return results.map(result => {
            let formattedDate = result._id;

            if(timeFrame === 'weekly') {
                const [year, week] = formattedDate.split('-');
                formattedDate = `Week ${parseInt(week)}, ${year}`;
            }
            return {
                date: formattedDate,
                count: result.count
            }
        })
    }

    async getTopInstructors(limit:number = 10):Promise<IUser[]>{
        return Courses.aggregate([
            {$match: { isDeleted: false, isPublished: true, enrolledCount : {$gt: 0}}},
            {$addFields: { totalRevenue: { $multiply: [ "$price", "$enrolledCount"]}}},
            {$group: { _id : "$instructor", totalSales: { $sum : "$enrolledCount"},  totalRevenue: { $sum : "$totalRevenue"}}},
            {$sort : { totalSales: -1}},
            {$limit: limit},
            {
                $lookup: {
                    from :'users',
                    localField: "_id",
                    foreignField: "_id",
                    as: "instructorDetails",
                },
            },
            {$unwind: "$instructorDetails"},
            {
                $project: {
                    _id: 0,
                    instructorId: "$_id",
                    name: { $concat: ["$instructorDetails.firstName", " ", "$instructorDetails.lastName"]},
                    profileImageUrl : "$instructorDetails.profileImageUrl",
                    totalSales: 1,
                    totalRevenue: 1,
                }
            }
        ]).exec();
    }
}