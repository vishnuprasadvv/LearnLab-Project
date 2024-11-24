import axios from 'axios';
import { User } from '@/types/adminTypes'; 
const apiurl = import.meta.env.VITE_API_URL;
const API_URL = apiurl  || 'http://localhost:5000/api';

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

export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/admin/user/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
