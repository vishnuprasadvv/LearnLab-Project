// src/features/admin/adminSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "@/app/store";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    removeUser(state, action) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    updateUser(state, action) {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
});

export const { setLoading, setUsers, setError, removeUser, updateUser } = adminSlice.actions;
export default adminSlice.reducer;
