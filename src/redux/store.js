import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { adminApi } from "./services/adminApi";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      adminApi.middleware
    ),
});
