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
    console.log(data)
    const response = await api.post(`${API_URL}/chat/create`,{...data}, { withCredentials: true});
    return response.data;
}