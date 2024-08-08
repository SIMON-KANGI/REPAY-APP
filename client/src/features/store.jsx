import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './auth/Authslice'
import { apiSlice } from "./auth/Authapi";
import messageReducer from "./messages/messageSlice"
export const store= configureStore({
    reducer:{
        auth:AuthReducer,
        message:messageReducer,
        api:apiSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware)

})