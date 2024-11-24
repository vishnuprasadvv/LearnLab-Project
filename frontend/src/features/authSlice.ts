import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login as loginAPI, logout as logoutAPI, register as registerAPI, verifyAccount as verifyAccountAPI, sendOtp as sendOtpAPI, validateUserAuth, forgotPassword, resetPasswordAPI} from "@/api/auth";
interface AuthState {
    user: {
        id: string;
        firstName: string;
        email : string ;
        role : string;
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

export const login = createAsyncThunk('auth/login', async(data: { email: string ; password: string}, { rejectWithValue }) => {
   
  try{
    const response = await loginAPI(data.email, data.password)
    return response;
  }catch(error : any){
    return rejectWithValue(error.response.data);
  }
 
})

export const logout = createAsyncThunk('auth/logout', async() => {
    const response = await logoutAPI();
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
          user: { id: string; email: string; role: string , firstName:string};
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

export const {
  startLoading,
  authSuccess,
  logoutSliceAction,
  setError,
  clearError,
  endLoading
} = authSlice.actions;

export default authSlice.reducer;