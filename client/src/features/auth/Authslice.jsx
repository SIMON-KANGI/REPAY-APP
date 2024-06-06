import {createSlice} from '@reduxjs/toolkit'

const AuthSlice =createSlice({
    name:'auth',
    initialState:{
        isLoggedIn:false,
        user:[],
        username:null,
        role:null,
        accessToken:null,
        profile:null
    },
    reducers:{
        setCredentials:(state,action)=>{
            const {username,accessToken,id,user,role,profile, isLoggedIn}=action.payload
            state.isLoggedIn=true
            state.username=username;
            state.accessToken=accessToken;
            state.id=id;
            state.user=user;
            state.role=role;
            state.profile=profile;
            
        },
        logout:(state,action)=>{ //logout state
            state.username=null;
            state.accessToken=null;
            state.id=null;
            state.user=null;
            state.role=null;
            state.profile=null;
        }
    }
})

export const {setCredentials,logout}=AuthSlice.actions;
export default AuthSlice.reducer

export const selectCurrentUser = (state) =>state?.auth?.username //export the current user  information after login
export const selectCurrentToken = (state) =>state?.auth?.accessToken //export the current user access token after login
export const selectCurrentRole = (state) =>state?.auth?.user?.role
export const selectUserData=(state)=>state?.auth.user