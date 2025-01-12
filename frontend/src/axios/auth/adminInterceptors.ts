import { config } from "@/config/config";
import { clearSpecificPersistedData } from "@/utils/clearPersist";
import axios from "axios";

const API_URL = config.app.PORT;

const adminInterceptorApi = axios.create({
    baseURL: `${API_URL}/admin`,
    withCredentials: true
})

//Request interceptor : 
adminInterceptorApi.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)

adminInterceptorApi.interceptors.response.use(
    (response) => {
        return response
    },
    async(error) => {
        console.log('admin interceptor error::',error)
        if(error.response?.status === 401){
            const errorMessage = error.response?.data?.message;
            if(errorMessage === 'Admin access token expired'){
                console.log('Admin access token expired, attempting refresh...');

                try {
                    const refreshResponse = await adminInterceptorApi.post(`${API_URL}/admin/refresh-token`, {}, {withCredentials: true});
                       
                   // //successfully refresh accesstoken
                    const newAccessToken = refreshResponse.data.adminAccessToken;

                    error.config.headers = error.config.headers || {}; ///

                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
                   return adminInterceptorApi(error.config)
               } catch (refreshError) {
                   console.log('Refesh token expired or invalid, Loggin out...')
                   // // logout user
                  // store.dispatch(logoutSliceAction())
                   // // //delete all persist data of auth
                    // persistor.purge();
                   // //navigate to login
                   
                   // //navigate to login
                   clearSpecificPersistedData('persist:admin')
                   window.location.href = '/admin/login'
                   return Promise.reject(refreshError)
               }

            }
            else if(errorMessage == 'Admin accessToken and refreshToken not found' || errorMessage == 'Invalid admin access token'){
                clearSpecificPersistedData('persist:admin')
                window.location.href = '/admin/login'
                return Promise.reject(error)
            }
            
        } 
        return Promise.reject(error)
    }
)

export default adminInterceptorApi