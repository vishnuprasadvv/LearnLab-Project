import api from "@/axios/auth/authInterceptors"
import { config } from "@/config/config";
const API_URL = config.app.PORT;

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

export const getFilteredCoursesUserApi = async (params: GetFilteredCourseParams) => {
  console.log('api', params)
    const response = await api.get(`${API_URL}/student/courses-filtered`, {params : params, withCredentials: true});
    return response.data;
}

export const getAllCoursesUserApi = async () => {
    const response = await api.get(`${API_URL}/student/home/courses`, { withCredentials: true});
    return response.data;
}

export const getAllCategoriesApi = async () => {
    try {
    const response = await api.get(`${API_URL}/student/categories`, {withCredentials: true});
    return response.data;
    } catch (error) {
      throw error
    }
  }

  export const getCourseByIdUserApi = async (courseId: string) => {
    try {
        const response = await api.get(`${API_URL}/student/courses/${courseId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data || error; // Propagate error to caller
      }
    
  }