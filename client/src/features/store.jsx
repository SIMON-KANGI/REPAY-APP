import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './auth/Authslice'
import { apiSlice } from "./auth/Authapi";
export const store= configureStore({
    reducer:{
        auth:AuthReducer,
        api:apiSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware)

})