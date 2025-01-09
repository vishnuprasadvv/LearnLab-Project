import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login as loginAPI, logout as logoutAPI, register as registerAPI, verifyAccount as verifyAccountAPI, sendOtp as sendOtpAPI, validateUserAuth, forgotPassword, resetPasswordAPI, handleGoogleLogin, handleRegisterToInstructor, handleChangePasswordAPI, handleEditUserAPI, changeProfileImage, getUserDataAPI, updateEmailUserProfileAPI} from "@/api/auth";
import { RegisterInstructorFormValues } from "@/types/instructor";
interface AuthState {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        phone : string;
        email : string ;
        role : string;
        createdAt?: Date;
        profileImageUrl?: string;
    } | null;
    loading: boolean;
    error: string  | null;
    isAuthenticated: boolean;
}

const initialState : AuthState = {
    isAuthenticated: false,
    user : null,
    loading: false,
    error: null,
}

export const login = createAsyncThunk('auth/login', async(data: { email: string ; password: string, role: string}, { rejectWithValue }) => {
   
  try{
    const response = await loginAPI(data.email, data.password, data.role)
    return response;
  }catch(error : any){
    return rejectWithValue(error.response.data);
  }
 
})

export const logout = createAsyncThunk('auth/logout', async() => {
    const response = await logoutAPI();
    return response
})

export const getUserDataThunk = createAsyncThunk('auth/user-data/:id', async(userId: string) => {
    const response = await getUserDataAPI(userId);
    return response
})

export const register = createAsyncThunk('auth/signup', async(data:{firstName : string, lastName : string, email : string, password : string, phone: string}, { rejectWithValue }) => {
   
  try {
    const response = await registerAPI(data.firstName, data.lastName, data.email, data.password, data.phone)
    return response;
  } catch (error : any) {
    return rejectWithValue(error.response.data)
  }
  
})

export const verifyAccount = createAsyncThunk('auth/verify-otp', async(data:{otp: string , email :string},{rejectWithValue})=>{
  try {
    const response = await verifyAccountAPI(data.email, data.otp)
    return response;
  } catch (error :any) {
    return rejectWithValue(error.response?.data || 'Verification failed')
  }
})
export const updateEmailUserProfile = createAsyncThunk('auth/profile/edit/email', async(data:{otp: string , email :string},{rejectWithValue})=>{
  try {
    const response = await updateEmailUserProfileAPI(data.email, data.otp)
    return response;
  } catch (error :any) {
    return rejectWithValue(error.response?.data || 'Verification failed')
  }
})

export const sendOtp = createAsyncThunk('auth/send-otp', async(data:{email :string},{rejectWithValue})=>{
  try {
    const response = await sendOtpAPI(data.email)
    return response;
  } catch (error :any) {
    return rejectWithValue(error.response.data)
  }
})

export const validateUser = createAsyncThunk("auth/validateUser", async (_, { rejectWithValue }) => {
  try {
   const response = await validateUserAuth()
   return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Validation failed");
  }
});

export const forgotPasswordThunk = createAsyncThunk('auth/reset-password', async(data:{email :string}, {rejectWithValue}) => {
  try {
    const response = await forgotPassword(data.email)
    return response
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const resetPasswordThunk = createAsyncThunk('auth/reset-password', async(data: {email : string, otp : string, password: string}, {rejectWithValue}) => {
  try {
    const response = await resetPasswordAPI(data.email, data.otp, data.password)
    return response
  } catch (error : any) {
    return rejectWithValue(error.response.data)
  }
})

export const googleLoginThunk = createAsyncThunk('auth/google', async(data: {token : string},{rejectWithValue}) => {
  try {
    const response = await handleGoogleLogin(data.token)
    return response
  } catch (error : any) {
    return rejectWithValue(error.response.data)
  }
})
//register instructor
export const registerInstructorThunk = createAsyncThunk('auth/instructor-register', async({data, userId} : {data:RegisterInstructorFormValues, userId: string}, {rejectWithValue}) => {
  try {
    const response = await handleRegisterToInstructor(data, userId)
    return response
  } catch (error : any) {
    return rejectWithValue(error.response.data)
  }
})

export const changePasswordThunk = createAsyncThunk('auth/profile/change-password', async(data : {oldPassword:string, newPassword: string}, {rejectWithValue}) => {
  try {
    const response = await handleChangePasswordAPI(data.oldPassword, data.newPassword)
    return response
  } catch (error : any) {
    return rejectWithValue(error.response.data)
  }
})

export const editProfileThunk = createAsyncThunk('auth/profile/edit', async(data : {firstName:string, lastName: string, email: string, phone: string}, {rejectWithValue}) => {
  try {
    const response = await handleEditUserAPI(data.firstName, data.lastName, data.email, data.phone)
    return response
  } catch (error : any) {
    return rejectWithValue(error.response.data)
  }
})
export const changeProfileImageThunk = createAsyncThunk('/student/profile/:id/update-image', async(data : {userId:string, formData:FormData}, {rejectWithValue}) => {
  try {
    const response = await changeProfileImage(data.userId, data.formData)
    return response
  } catch (error : any) {
    return rejectWithValue(error.response.data)
  }
})

//slice

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
      // Start loading state
      startLoading(state) {
        state.loading = true;
        state.error = null;
      },
      endLoading(state){
        state.loading = false;
        state.error = null;
      },
      // Successful login/signup
      authSuccess(
        state,
        action: PayloadAction<{
          user: { _id: string; email: string; role: string , firstName:string , lastName: string, 
            phone: string, createdAt?: Date, profileImageUrl?: string};
        }>
      ) {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = true;
      },
      // Logout user
      logoutSliceAction(state) {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated= false;
      },
      // Error handling
      setError(state, action: PayloadAction<string>) {
        state.loading = false;
        state.error = action.payload;
      },
      // Clear errors
      clearError(state) {
        state.error = null;
        state.loading = false
      },
      
    },
 
})

export default authSlice.reducer;
export const {
  startLoading,
  authSuccess,
  logoutSliceAction,
  setError,
  clearError,
  endLoading
} = authSlice.actions;
