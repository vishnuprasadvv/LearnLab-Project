import api from "@/axios/auth/authInterceptors"
import { config } from "@/config/config";
const API_URL = config.app.PORT;


//get all courses list
export const getAllCoursesUserApi = async () => {
    const response = await api.get(`${API_URL}/student/home/courses`, {withCredentials: true});
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