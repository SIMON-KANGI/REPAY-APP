import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './auth/Authslice';
import { apiSlice } from "./auth/Authapi";
import messageReducer from "./messages/messageSlice";
import contactReducer from "./contacts/contactSlice"
export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        message: messageReducer,
        contact:contactReducer, // Note: the key here is `message`
        api: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});
