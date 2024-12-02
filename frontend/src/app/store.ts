import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../features/authSlice";
import adminReducer from "../features/adminSlice";

const userPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const adminPersistConfig = {
  key: "admin",
  storage,
  whitelist: ["user", "isAuthenticated"],
};
const rootReducer = combineReducers({
  admin: persistReducer(adminPersistConfig, adminReducer),
  auth: persistReducer(userPersistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
 