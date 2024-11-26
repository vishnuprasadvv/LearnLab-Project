import axios from 'axios';
import { User } from '@/types/adminTypes'; 
const apiurl = import.meta.env.VITE_API_URL;
const API_URL = apiurl  || 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// Function to get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId: string, status: string): Promise<any> => {
  try {
    const response = await axios.patch(`${API_URL}/admin/users/${userId}/status`,{status});
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const createUser = async (firstName: string, lastName: string, email: string, phone : string, password: string, role: string, userStatus : string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/admin/users/create`, {firstName, lastName, email, phone, password, role, userStatus});
    return response.data;
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error creating user:', error.response.data.message || error.response.data);
    } else {
      console.error('Error creating user:', error.message);
    }
    throw error;
  }
}
export const editUserPost = async (firstName: string, lastName: string, email: string, phone : string, password: string, role: string, userStatus : string ,userId: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/admin/users/edit/${userId}`, {firstName, lastName, email, phone, password, role, userStatus});
    return response.data;
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error creating user:', error.response.data.message || error.response.data);
    } else {
      console.error('Error creating user:', error.message);
    }
    throw error;
  }
}
export const editUserGet = async (userId:string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/admin/users/edit/${userId}`);
    return response.data;
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error getting user:', error.response.data.message || error.response.data);
    } else {
      console.error('Error getting user:', error.message);
    }
    throw error;
  }
}


