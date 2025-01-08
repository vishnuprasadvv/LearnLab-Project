import mongoose, { Document, Schema} from "mongoose";

export interface IUser extends Document {
    firstName : string;
    lastName : string;
    password?: string;
    email : string;
    role : string;
    isVerified: boolean;
    profileImageUrl? : string,
    profileImagePublicId?:string,
    status: string,
    phone: string,
    googleId : string,
    _id: string,
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema : Schema = new Schema({
    firstName  : {type: String, required : true},
    lastName : {type : String, required : true},
    email : {type: String, required : true, unique :true},
    phone : {type: String,},
    password : {type : String, },
    role : {type: String , enum : ['admin', 'student', 'instructor'], default : 'student'} ,
    isVerified : {type :Boolean, default: false},
    status : {type:String, enum: ['active', 'inactive'], default: 'active'},
    googleId : {type: String},
    profileImageUrl : {type: String},
    profileImagePublicId : {type: String},
},{timestamps: true});


export default mongoose.model<IUser>('User', UserSchema);

