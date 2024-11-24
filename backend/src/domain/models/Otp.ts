import mongoose ,{Document, Schema} from "mongoose";

export interface IOtp extends Document{
    email : string;
    otp : string;
    expiresAt : Date;
}

const OtpSchema : Schema = new Schema({
    email : {type: String, required : true},
    otp : {type : String, required: true},
    expiresAt : {type : Date, required : true}
});

export default mongoose.model<IOtp>('Otp', OtpSchema)