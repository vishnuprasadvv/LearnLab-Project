import mongoose, { Document, Schema} from "mongoose";

export interface IUser extends Document {
    firstName : string;
    lastName : string;
    password: string;
    email : string;
    role : 'admin' | 'student' | 'instructor';
    isVerified: boolean;
    avatar : {public_id: string, url : string}

}

const UserSchema : Schema = new Schema({
    firstName  : {type: String, required : true},
    lastName : {type : String, required : true},
    email : {type: String, required : true, unique :true},
    password : {type : String, required : true},
    role : {type: String , enum : ['admin', 'student', 'instructor'], default : 'student'} ,
    isVerified : {type :Boolean, default: false},
    
    avatar : {public_id: String, url : String}
},{timestamps: true});


export default mongoose.model<IUser>('User', UserSchema);

