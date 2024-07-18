import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from './Authslice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://repay-app.onrender.com', // URL for the API
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const accessToken = getState().auth.accessToken; // Access token when login is successful
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return headers;
    }
});

// Get a new access token when the access token expires
const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.originalStatus === 403) {
        console.log('Sending refresh token');

        // Implement refresh token logic here
        const refreshToken = getState().auth.refreshToken;
        const refreshResult = await baseQuery({
            url: '/refresh-token',
            method: 'POST',
            body: { refreshToken }
        }, api, extraOptions);

        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            // Assuming refreshResult.data contains the new accessToken and refreshToken
            api.dispatch(setCredentials({ 
                accessToken: refreshResult.data.accessToken, 
                refreshToken: refreshResult.data.refreshToken, 
                user 
            }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials
            }),
        }),
        // Other endpoints can be defined here
    }),
});

export const { useLoginMutation } = apiSlice;