import { IChat } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState{
    messages: {senderId: string, messageText: string, sentAt: string}[];
    typingStatus: boolean;
    selectedChat: IChat | null;
    onlineUsers:string[] | [];
}

const initialState : ChatState = {
    messages: [],
    typingStatus: false,
    selectedChat: null,
    onlineUsers: []
}

const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers: {
        addMessage(state, action: PayloadAction<{senderId: string, messageText: string, sentAt:string}>){
            state.messages.push(action.payload)
        },
        setTypingStatus(state, action: PayloadAction<boolean>){
            state.typingStatus = action.payload;
        },
        setSelectedChat(state, action: PayloadAction<IChat|null>){
            state.selectedChat = action.payload;
        },
        resetSelectedChat(state) {
            state.selectedChat = null;
        },
        setOnlineUsers(state, action: PayloadAction<string[] | []>){
            state.onlineUsers = action.payload;
        },
        resetOnlineUsers(state) {
            state.onlineUsers = [];
        }
    }
})

export const {addMessage, setTypingStatus, setSelectedChat, resetSelectedChat,setOnlineUsers ,resetOnlineUsers} = chatSlice.actions;
export default chatSlice.reducer;