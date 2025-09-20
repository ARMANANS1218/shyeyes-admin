import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware, userApi.middleware),
});
