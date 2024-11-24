import axios from "axios";

const apiurl = import.meta.env.VITE_API_URL;
const API_URL = apiurl  || 'http://localhost:5000/api';

export const login = async (email : string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {email, password}, {withCredentials: true});
    return response.data;
}


export const logout = async() => {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, {withCredentials: true});
    return response.data;
}

export const register = async( firstName : string, lastName : string, email : string, password : string, phone :string) => {
    const response = await axios.post(`${API_URL}/auth/signup`, {firstName, lastName, email, password, phone})
    return response.data;
}

export const verifyAccount = async( email: string, otp : string ) => {
    
        const response = await axios.post(`${API_URL}/auth/verify-otp`, {email, otp})
        return response.data; 
    
    
}

export const sendOtp = async( email: string ) => {
    const response = await axios.post(`${API_URL}/auth/send-otp`, {email})
    return response.data;
}
export const validateUserAuth = async( ) => {
    const response = await axios.post(`${API_URL}/auth/verify-user-token`,{ withCredentials: true })
    return response.data;
}

export const forgotPassword = async (email: string) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {email})
    return response.data;
}

export const resetPasswordAPI = async (email: string, otp: string, password : string) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {email, otp, password});
    return response.data;
}


export const googleLoginAPI = async (token: string) => {
    const response = await axios.post(`${API_URL}/auth/google-login`, {token});
    return response.data;
}