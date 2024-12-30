import mongoose from "mongoose";

export interface IChat {
    _id?: string | mongoose.Types.ObjectId;
    participants: string[] | mongoose.Types.ObjectId[];
    chatType: 'private' | 'group';
    chatName?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    lastMessageSentAt?: Date | null;
}

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  chatType: { type: String, enum: ['private', 'group'], required: true },
  chatName: { type: String , default: null }, // Optional for group chats
  lastMessageSentAt: {type: Date}
}, {timestamps: true});

export const Chat = mongoose.model('Chat', ChatSchema);