import axios from 'axios';
import { User } from '@/types/adminTypes';
import adminInterceptorApi from '@/axios/auth/adminInterceptors';
import { config } from '@/config/config';
const API_URL = config.app.PORT;

export const adminLogin = async (email : string, password: string, role: string) => {
  const response = await adminInterceptorApi.post(`${API_URL}/admin/login`, {email, password, role}, {withCredentials: true});
  return response.data;
}

export const adminLogout = async() => {
  const response = await adminInterceptorApi.post(`${API_URL}/admin/logout`)
  return response
} 


// Function to get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await adminInterceptorApi.get(`${API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const toggleUserStatus = async (userId: string, status: string): Promise<any> => {
  try {
    const response = await adminInterceptorApi.patch(`${API_URL}/admin/users/${userId}/status`,{status});
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};


export const createUser = async (firstName: string, lastName: string, email: string, phone : string, password: string, role: string, userStatus : string): Promise<any> => {
  try {
    const response = await adminInterceptorApi.post(`${API_URL}/admin/users/create`, {firstName, lastName, email, phone, password, role, userStatus});
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
export const editUserPost = async (firstName: string, lastName: string, email: string, phone : string, role: string, userStatus : string ,userId: string): Promise<any> => {
  try {
    const response = await adminInterceptorApi.post(`${API_URL}/admin/users/edit/${userId}`, {firstName, lastName, email, phone, role, userStatus});
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
    const response = await adminInterceptorApi.get(`${API_URL}/admin/users/edit/${userId}`);
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


export const getInstructorsAPI = async () => {
  const response = await adminInterceptorApi.get(`${API_URL}/admin/instructors`, {withCredentials: true});
  return response.data;
}

export const getInstructorApplicationAPI = async (id: string) => {
  try {
  const response = await adminInterceptorApi.get(`${API_URL}/admin/instructor/application/${id}`, {withCredentials: true});
  return response.data;
  } catch (error) {
    throw error
  }
}
export const acceptInstructorApplicationAPI = async (id: string) => {
  try {
  const response = await adminInterceptorApi.post(`${API_URL}/admin/instructor/application/${id}/accept`, {withCredentials: true});
  return response.data;
  } catch (error) {
    throw error
  }
}

export const rejectInstructorApplicationAPI = async (id: string) => {
  try {
  const response = await adminInterceptorApi.post(`${API_URL}/admin/instructor/application/${id}/reject`, {withCredentials: true});
  return response.data;
  } catch (error) {
    throw error
  }
}
