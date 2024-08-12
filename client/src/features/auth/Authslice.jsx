import { createSlice, createAsyncThunk,createSelector } from '@reduxjs/toolkit';

// Define an async thunk for fetching credentials
export const fetchCredentials = createAsyncThunk(
  'auth/fetchCredentials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://127.0.0.1:5555/auth/login', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    username: null,
    role: null,
    accessToken: null,
    refreshToken: null,
    profile: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { username, accessToken, refreshToken, user, role, profile } = action.payload;
      state.isLoggedIn = true;
      state.username = username;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.role = role;
      state.profile = profile;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    },
    logout: (state) => {
      state.username = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.role = null;
      state.profile = null;
      state.isLoggedIn = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCredentials.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role;
      state.profile = action.payload.profile;
    });
    builder.addCase(fetchCredentials.rejected, (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.username = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.profile = null;
    });
  },
});

export const loadUserFromStorage = () => (dispatch) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      dispatch(setCredentials({ accessToken }));
    }
  };
  
export const { setCredentials, logout } = AuthSlice.actions;
export default AuthSlice.reducer;

export const selectCurrentUser = (state) => state.auth.username;
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectCurrentRole = (state) => state.auth.role;
export const selectUserData = (state) => state.auth.user;
