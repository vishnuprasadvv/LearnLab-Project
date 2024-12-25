import mongoose, { Document } from "mongoose";

export interface IMessages {
    senderId : string | mongoose.Types.ObjectId;
    replyToMessageId? : string | mongoose.Types.ObjectId | null;
    messageText : string;
    image? : string | null;
    imagePublicUrl? : string| null;
    isRead : boolean;
    sentAt : Date;
    chatId : string | mongoose.Types.ObjectId;
    _id? : string | mongoose.Types.ObjectId;
}

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messageText: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    replyToMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    isRead: { type: Boolean, default: false },
    image: {type:String },
    imagePublicUrl: {type:String }
  });
  
 export const Message = mongoose.model('Message', MessageSchema);