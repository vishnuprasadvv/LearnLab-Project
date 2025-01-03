import { config } from "@/config/config";
import api from "@/axios/auth/authInterceptors";
import { AxiosProgressEvent } from "axios";

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

export const editCourseApi = async (data: FormData, id: string) => {
    try {
        const response = await api.patch(`${API_URL}/instructor/courses/${id}/edit`,data, {
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


export const createCourseLectureApi = async (data: FormData, courseId : string,
   onUploadProgress :(progressEvent : AxiosProgressEvent) => void, 
   ) => {
  try {
      const response = await api.post(`${API_URL}/instructor/courses/create/${courseId}/lecture`,data, {
        onUploadProgress,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
         
        });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}

export const editCourseLectureApi = async (data: FormData, courseId : string,
   onUploadProgress :(progressEvent : AxiosProgressEvent) => void, 
   ) => {
  try {
      const response = await api.patch(`${API_URL}/instructor/courses/${courseId}/edit/lecture`,data, {
        onUploadProgress,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
         
        });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}

export const getCourseById = async (courseId: string) => {
  try {
      const response = await api.get(`${API_URL}/instructor/courses/${courseId}`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}

export const deleteCourseApi = async (courseId: string) => {
  try {
      const response = await api.patch(`${API_URL}/instructor/courses/${courseId}/delete`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}

export const publishCourseApi = async (courseId: string , publishValue : boolean) => {
  try {
      const response = await api.patch(`${API_URL}/instructor/courses/${courseId}/publish`,{publishValue}, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
  
}
export const getInstructorPurchsesApi = async () => {
  try {
      const response = await api.get(`${API_URL}/instructor/purchases`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
}
export const getDashboardMetricsApi = async () => {
  try {
      const response = await api.get(`${API_URL}/instructor/dashboard-metrics`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
}

export const getDashboardEarningsApi = async () => {
  try {
      const response = await api.get(`${API_URL}/instructor/dashboard-earnings`, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      throw error?.response?.data || error; // Propagate error to caller
    }
}