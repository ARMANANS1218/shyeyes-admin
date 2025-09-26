import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { adminApi } from "./services/adminApi";
import { agentApi } from "./services/agentApi";
import authReducer from "./slice/authSlice";
import { roleAuthApi } from "./services/roleAuthApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [roleAuthApi.reducerPath]: roleAuthApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      adminApi.middleware,
      agentApi.middleware,
      roleAuthApi.middleware
    ),
});
