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

  export const getCourseByIdUserApi = async (courseId: string, userId: string | null) => {
    const url = userId 
            ? `${API_URL}/student/courses/${courseId}?userId=${userId}`
            : `${API_URL}/student/courses/${courseId}`

    try {
        const response = await api.get(url, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data || error; // Propagate error to caller
      }
    
  }


  interface Course {
    courseId: string ;
      courseTitle : string;
      coursePrice : Number;
      courseImage: string;
      courseInstructor ?: string;
      courseLevel ?: string;
      courseDescription ?:string ;
      courseDuration ?: number
      courseLecturesCount ?: number
      courseInstructorImage ?: string
  }
  export const purchaseCourseApi = async (courses:[Course]) => {
    try {
        const response = await api.post(`${API_URL}/student/order/create`,{courses}, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data || error; // Propagate error to caller
      }
    
  }
  export const fetchMyCoursesApi = async () => {
    try {
        const response = await api.get(`${API_URL}/student/profile/courses`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data || error; // Propagate error to caller
      }
    
  }