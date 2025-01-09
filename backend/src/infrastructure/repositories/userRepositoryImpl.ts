
import { IUserRepository } from "../../application/repositories/IUserRepository";
import User, {IUser} from "../../domain/models/User";
import Courses from "../../domain/models/Courses";
import { preprocessQuery } from "../../utils/preprocessQuery";

export class UserRepositoryImpl implements IUserRepository {
    async findById(userId: string): Promise<IUser | null> {
        return User.findById(userId).select('-password')
    }

    async findByIdWithPassword(userId: string): Promise<IUser | null> {
        return User.findById(userId)
    }

    async approveUserSignupVerification(email: string):Promise<boolean>{
        const updatedUser = await User.updateOne({email}, {isVerified: true})
         // Check if the user was found and updated
    if (updatedUser.matchedCount > 0 && updatedUser.modifiedCount > 0) {
        return true;
    }
    return false; 
    }

    async findEmailAlreadyExists (email: string, userid: string) : Promise<boolean> {
        const findUser = await User.findOne({ email: email, _id: {$ne: userid}})
        return findUser ? true : false;
    }

    async updatePassword(userId: string, newPassword: string):Promise<IUser | null> {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, 
                { password: newPassword},
                {new : true, runValidators: true}
            ).select('-password');

            return updatedUser;
        } catch (error) {
            throw error
        }
    }

    async update(user: Partial<IUser>):Promise<IUser | null> {
        const {_id, ...rest} = user
        const updated = await User.findByIdAndUpdate(_id, {...rest}, {new: true, runValidators: true}).select('-password')
        return updated;
    }
    async save(user:IUser): Promise<IUser> {
        return user.save();
    }

    //signup 
    async createUser(user:Partial<IUser>) : Promise<IUser> {
        const newUser = new User(user);
        return await newUser.save(); 
        
    }

    //login
    async getUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({email})
    }
    async getAllUsersExcluded(userId:string): Promise<IUser[]> {
        return await User.find({_id:{$ne: userId}  ,isVerified: true, status : 'active', role:{$ne:'admin'}}).select('-password -googleId -profileImagePublicId')
    }
    async getAllUsers():Promise<IUser[]> {
        return await User.find()
    }

    async getAllInstructorsListForUser(userId: string): Promise<IUser[]> {
        return await User.find({_id:{$ne: userId}  ,isVerified: true, status : 'active', role:{$eq:'instructor'}}).select('-password -googleId -profileImagePublicId')
    }

    async countAll(): Promise<number> {
        return await User.countDocuments();
    }

    async countByStatus(status: string): Promise<number> {
        return await User.countDocuments({status})
    }

    async countByRole(): Promise<{ student: number; instructor: number; admin: number; }> {
        const roles:{_id:string, count:number}[] = await User.aggregate([
            {$match: { isVerified: true, status: 'active'}},
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

    //admin 
    async getAllUsersAdminWithFilter ( search: string, page: number, limit: number): Promise<{users: IUser[]; total: number}> {
        const searchQuery = preprocessQuery(search)
        const query = {
            $and: [
                { role: { $ne: "admin" } },
                ...(search
                  ? [
                      {
                        $or: [
                          { firstName: { $regex: new RegExp(searchQuery, "i") } },
                          { lastName: { $regex: new RegExp(searchQuery, "i") } },
                          {
                            $expr: {
                              $regexMatch: {
                                input: { $concat: ["$firstName", "$lastName"] },
                                regex: searchQuery,
                                options: "i",
                              },
                            },
                          },
                        ],
                      },
                    ]
                  : []),
              ],
        }

        const skip = (Number(page) -1) * Number(limit);

        const users = await User.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit));
        const total = await User.countDocuments(query);
        return { users, total }
    }

    async deleteUser(userId: string):Promise<boolean> {
        const result = await User.findByIdAndDelete(userId);
        return result ? true : false;
    }

    async updateUserStatusAdmin(userId:string, status: string):Promise<IUser | null>{
        const updated = await User.findByIdAndUpdate(userId, {status}, { new : true})
       return updated ;
    }

    async updateUserRoleAdmin(userId:string, role: string):Promise<IUser | null>{
        const updated = await User.findByIdAndUpdate(userId, {role}, { new : true})
       return updated ;
    }
}