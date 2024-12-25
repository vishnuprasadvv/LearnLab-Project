import { IChat } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState{
    messages: {senderId: string, messageText: string, sentAt: string}[];
    typingStatus: boolean;
    selectedChat: IChat | null
}

const initialState : ChatState = {
    messages: [],
    typingStatus: false,
    selectedChat: null
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
    }
})

export const {addMessage, setTypingStatus, setSelectedChat, resetSelectedChat} = chatSlice.actions;
export default chatSlice.reducer;