// src/features/admin/adminSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getInstructorsAPI } from "@/api/adminApi";

interface User {
  _id: string;
  firstName: string;
  email: string;
  role: string;
  phone : string;
  lastName: string;
}

interface AdminState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated : boolean;
  adminToken?: string;
  error: string | null;
}

export const getInstructorsThunk = createAsyncThunk("admin/instructors", async (_, { rejectWithValue }) => {
  try {
   const response = await getInstructorsAPI()
   return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "failed to get instructors");
  }
});




const initialState: AdminState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  adminToken: ''
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    endLoading(state){
      state.isLoading = false;
      state.error = null;
    },
    // Successful login/signup
    adminLoginSuccess(
      state,
      action: PayloadAction<{
        user: { _id: string; email: string; role: string , firstName:string , lastName: string, phone: string};
        adminToken?: string
      }>
    ) {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      state.isAuthenticated = true;
      state.adminToken = action.payload.adminToken
    },
    // Logout user
    adminLogoutSliceAction(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated= false;
      state.adminToken = ''
    },
    // Error handling
    setError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Clear errors
    clearError(state) {
      state.error = null;
      state.isLoading = false
    },
    
  },
});

export const {
  startLoading,
  adminLoginSuccess,
  adminLogoutSliceAction,
  setError,
  clearError,
  endLoading
} = adminSlice.actions;
export default adminSlice.reducer;
