import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials,logout } from './Authslice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:5555', //url for the api
    credentials: 'include', // Corrected typo
    prepareHeaders: (headers, { getState }) => {
        const accessToken = getState().auth.accessToken; //access token when the login is successful
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return headers;
    }
});
// get a new access token when the access token expires
const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.originalStatus === 403) {
        console.log('sending refresh token');
        // const refreshToken = localStorage.getItem('refresh_token');
        // Implement refresh token logic here
        
        const refreshResult = await baseQuery('/login', api, extraOptions);
        console.log(refreshResult);
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            api.dispatch(setCredentials({ ...refreshResult.data, user }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({})
});
