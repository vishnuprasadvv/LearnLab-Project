import axios from 'axios';
import { User } from '@/types/adminTypes';
import adminInterceptorApi from '@/axios/auth/adminInterceptors';
import { config } from '@/config/config';
const API_URL = config.app.PORT;

export const adminLogin = async (email : string, password: string) => {
  const response = await adminInterceptorApi.post(`${API_URL}/admin/login`, {email, password}, {withCredentials: true});
  return response.data;
}

export const adminLogout = async() => {
  const response = await adminInterceptorApi.post(`${API_URL}/admin/logout`)
  return response
} 

export const validateAdminAuth = async( ) => {
  try {
  const response = await adminInterceptorApi.post(`${API_URL}/auth/verify-admin-token`,{ withCredentials: true })
  return response.data;
  } catch (error) {
      throw error
  }
}


// Function to get all users
export const getUsers = async (search:string, page:number, limit:number): Promise<User[]> => {
  try {
    const response = await adminInterceptorApi.get(`${API_URL}/admin/users`, {
      params:{search, page, limit}
    });
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

export const getAllCategories = async (currentPage: number, itemsPerPage: number, searchQuery: string) => {
  try {
  const response = await adminInterceptorApi.get(`${API_URL}/admin/categories`, {params: {page:currentPage, limit:itemsPerPage, query:searchQuery}, withCredentials: true});
  return response.data;
  } catch (error) {
    throw error
  }
}
export const getAllCategoriesAtOnce = async () => {
  try {
  const response = await adminInterceptorApi.get(`${API_URL}/admin/categories/all`, {withCredentials: true});
  return response.data;
  } catch (error) {
    throw error
  }
}


export const createCategory = async (name:string, description: string, parentCategory: string | null , isActive: boolean) => {
  try {
    let parentCategoryId = null
    if(parentCategory === 'none'){
      parentCategoryId === null
    }else{
      parentCategoryId = parentCategory
    }
  const response = await adminInterceptorApi.post(`${API_URL}/admin/categories/add`,{name, description, parentCategoryId, isActive}, {withCredentials: true});
  return response.data;
  } catch (error) {
    throw error
  }
}

export const editCategory = async (id: string, name:string, description: string, parentCategory: string | null , isActive: boolean) => {
  try {
    let parentCategoryId = null
    if(parentCategory === 'none'){
      parentCategoryId === null
    }else{
      parentCategoryId = parentCategory
    }
  const response = await adminInterceptorApi.put(`${API_URL}/admin/categories/${id}/edit`,{name, description, parentCategoryId, isActive}, {withCredentials: true});
  return response.data;
  } catch (error) {
    throw error
  }
}

// export const getAllCoursesAdminApi = async (searchQuery: string, currentPage:number, itemsPerPage:number) => {
//   try {
//       const response = await adminInterceptorApi.get(`${API_URL}/admin/courses`, {params:{ query: searchQuery, page: currentPage, limit : itemsPerPage}, withCredentials: true });
//       return response.data;
//   } catch (error: any) {
//       throw error?.response?.data || error; // Propagate error to caller
//     } 
// }

//get all courses list
interface GetFilteredCourseParams {
  categories?: string;
  sortBy? : string;
  rating?: number;
  level ? : string;
  page? : number;
  limit ? : number;
  query? : string
}

export const getAllCoursesAdminApi = async (params:GetFilteredCourseParams) => {
  try {
      const response = await adminInterceptorApi.get(`${API_URL}/admin/courses`, {params:params, withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    } 
}

export const getCourseByIdAdminApi = async (courseId: string) => {
  try {
      const response = await adminInterceptorApi.get(`${API_URL}/admin/courses/${courseId}`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}

export const deleteCourseAdminApi = async (courseId: string) => {
  try {
      const response = await adminInterceptorApi.patch(`${API_URL}/admin/courses/${courseId}/delete`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}

export const publishCourseAdminApi = async (courseId: string , publishValue : boolean) => {
  try {
      const response = await adminInterceptorApi.patch(`${API_URL}/admin/courses/${courseId}/publish`,{publishValue}, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}
export const getPurchasesApi = async () => {
  try {
      const response = await adminInterceptorApi.get(`${API_URL}/admin/purchases`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}

//dashboard

export const getDashboardDataApi = async() => {
  try {
    const response = await adminInterceptorApi.get(`${API_URL}/admin/dashboard`, { withCredentials: true });
    return response.data;
} catch (error: any) {
    throw error?.response?.data || error; 
  }
}
export const getBestSellingCoursesApi = async(limit: number) => {
  try {
    const response = await adminInterceptorApi.get(`${API_URL}/admin/best-courses`, { params:{limit}, withCredentials: true });
    return response.data;
} catch (error: any) {
    throw error?.response?.data || error; 
  }
}
export const getTopInstructorsApi = async(limit: number) => {
  try {
    const response = await adminInterceptorApi.get(`${API_URL}/admin/top-instructors`, { params:{limit}, withCredentials: true });
    return response.data;
} catch (error: any) {
    throw error?.response?.data || error; 
  }
}
export const getJoinedUsersDataApi = async(timeFrame: string) => {
  try {
    const response = await adminInterceptorApi.get(`${API_URL}/admin/user-registration-analytics`, {params:{timeFrame}, withCredentials: true });
    return response.data;
} catch (error: any) {
    throw error?.response?.data || error; 
  }
}
export const getCompanyProfitDataApi = async(timeFrame: string) => {
  try {
    const response = await adminInterceptorApi.get(`${API_URL}/admin/company-profit`, {params:{timeFrame}, withCredentials: true });
    return response.data;
} catch (error: any) {
    throw error?.response?.data || error; 
  }
}