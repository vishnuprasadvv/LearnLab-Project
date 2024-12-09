import { config } from "@/config/config";
import api from "@/axios/auth/authInterceptors";

const API_URL = config.app.PORT;

export const createCourseApi = async (data: FormData) => {
    try {
        const response = await api.post(`${API_URL}/instructor/courses/create`,data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
          });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data || error; // Propagate error to caller
      }
    
}

export const getAllCoursesListApi = async () => {
  try {
      const response = await api.get(`${API_URL}/instructor/courses`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}


export const createCourseLectureApi = async (data: FormData, courseId : string) => {
  try {
      const response = await api.post(`${API_URL}/instructor/courses/create/${courseId}/lecture`,data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}