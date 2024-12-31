import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../features/authSlice";
import adminReducer from "../features/adminSlice";
import chatReducer from '../features/chatSlice'
import wishlistReducer from '../features/wishlistSlice'

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

const chatPersistConfig = {
  key: 'chat',
  storage,
  whitelist: ['messages', 'selectedChat']
}

const wishlistPersistConfig = {
  key: 'wishlist',
  storage,
  whitelist:['courseIds']
}

const rootReducer = combineReducers({
  admin: persistReducer(adminPersistConfig, adminReducer),
  auth: persistReducer(userPersistConfig, authReducer),
  chat: persistReducer(chatPersistConfig, chatReducer),
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer)
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
 