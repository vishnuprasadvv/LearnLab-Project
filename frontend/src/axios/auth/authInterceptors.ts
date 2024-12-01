import { persistor } from "@/app/store";
import { config } from "@/config/config";
import { clearSpecificPersistedData } from "@/utils/clearPersist";
import axios from "axios";

const API_URL = config.app.PORT; 

const api = axios.create({
    baseURL: `${API_URL}/auth`,
    withCredentials: true
})

//Request interceptor : 
api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        console.log('response interceptor')
        return response
    },
    async(error) => {
        console.log('interceptor error::',error)
        if(error.response?.status === 401){
            const errorMessage = error.response?.data?.message ;
            if(errorMessage === 'Access token expired'){
                console.log('Access token expired, attempting refresh...');

                try {
                    const refreshResponse = await api.post(`${API_URL}/auth/refresh-token`, {}, {withCredentials: true});
    
                    //successfully refresh accesstoken
                    const newAccessToken = refreshResponse.data.accessToken;
                    error.config.headers = error.config.headers || {};
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return api(error.config)
                } catch (refreshError) {
                    console.log('Refesh token expired or invalid, Loggin out...')
                    // // logout user
                   // store.dispatch(logoutSliceAction())
                    // // //delete all persist data of auth
                     // persistor.purge();
                    // //navigate to login
                     clearSpecificPersistedData('persist:auth')
                   window.location.href = '/login'
                    return Promise.reject(refreshError)
                }
            }
            
        } 
        return Promise.reject(error)
    }
)


export default api;