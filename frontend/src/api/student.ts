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
    const response = await api.get(`${API_URL}/student/courses-filtered`, {params : params});
    return response.data;
}

export const getAllCoursesUserApi = async () => {
    const response = await api.get(`${API_URL}/student/home/courses`);
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

  export const getCourseProgressApi = async(courseId: string) => {
    try {
      const response = await api.get(`${API_URL}/student/progress/${courseId}`, { withCredentials: true})
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || error
    }
  }
  export const markAsIncompletedApi = async(courseId: string) => {
    try {
      const response = await api.put(`${API_URL}/student/progress/${courseId}/incompleted`, { withCredentials: true})
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || error
    }
  }
  export const markAsCompletedApi = async(courseId: string) => {
    try {
      const response = await api.put(`${API_URL}/student/progress/${courseId}/completed`, { withCredentials: true})
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || error
    }
  }

  export const markVideoCompleteApi = async (
    courseId: string,
    lectureId: string,
    videoId: string
  ) => {
    const response = await api.post(
      `${API_URL}/student/progress/${courseId}/lectures/${lectureId}/videos/${videoId}`
    );
    return response.data;
  };
  export const getVideoSecureUrl = async (
    courseId: string,
    lectureId: string,
    videoId: string
  ) => {
    const response = await api.get(
      `${API_URL}/student/stream/${courseId}/${lectureId}/${videoId}`,
      {responseType: 'blob', withCredentials: true}
    );
    return response.data;
  };

  export const addToWishlistApi = async(courseId: string)=> {
    const response = await api.post(`${API_URL}/student/wishlist/add`, {courseId})
    return response.data
  }
  export const removeFromWishlistApi = async(courseId: string)=> {
    const response = await api.post(`${API_URL}/student/wishlist/delete`, {courseId})
    return response.data
  }
  export const getWishlistApi = async()=> {
    const response = await api.get(`${API_URL}/student/wishlist`)
    return response.data
  }
  
export const getWishlistCourseIds = async() => {
  const response = await api.get(`${API_URL}/student/wishlist/ids`)
  return response.data;
}