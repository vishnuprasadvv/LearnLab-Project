import api from "@/axios/auth/authInterceptors"
import { config } from "@/config/config";
const API_URL = config.app.PORT;


export const getChatUsersApi = async () => {
    const response = await api.get(`${API_URL}/chat/users`, { withCredentials: true});
    return response.data;
}

export const getUserChatsApi = async () => {
    const response = await api.get(`${API_URL}/chat/chats`, { withCredentials: true});
    return response.data;
}

export const createChatApi = async (data:{participants:string[], chatType: string , chatName?: string} ) => {
    const response = await api.post(`${API_URL}/chat/create`,{...data}, { withCredentials: true});
    return response.data;
}
//delete chat
export const deleteChatUserApi = async (chatId: string ) => {
    const response = await api.delete(`${API_URL}/chat/delete/${chatId}`, { withCredentials: true});
    return response.data;
}

export const getChatMessages = async (chatId:string ) => {
    const response = await api.get(`${API_URL}/chat/messages/${chatId}`, { withCredentials: true});
    return response.data;
}

export const sendMessageApi = async (data:{senderId: string, messageText: string, chatId: string , image?:File | null} ) => {
   const formData = new FormData();
   formData.append('senderId', data.senderId);
   formData.append('chatId', data.chatId);
   formData.append('messageText', data.messageText)
   if(data.image){
    formData.append('messageImage', data.image)
   }
    const response = await api.post(`${API_URL}/chat/messages/send`,formData, { headers:{ 'Content-Type':"multipart/form-data" }, withCredentials: true});
    return response.data;
}

export const markAsReadApi = async (data:{chatId: string, userId: string} ) => {
    const response = await api.post(`${API_URL}/chat/messages/markAsRead`,{...data}, { withCredentials: true});
    return response.data;
}