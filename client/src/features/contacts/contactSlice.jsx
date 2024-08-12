import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch contacts from the backend
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async () => {
    const response = await axios.get('http://127.0.0.1:5555/contacts');
    return response.data;
});

const contactSlice = createSlice({
    name: 'contacts',
    initialState: {
        contacts: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        addContacts: (state, action) => {
            state.contacts.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addContacts } = contactSlice.actions;

// Adjusted to match the state key used in configureStore
const selectContactState = (state) => state.contact;

export const selectContacts = createSelector(
    [selectContactState],
    (contactState) => contactState?.contacts || []
);

export const selectContactStatus = createSelector(
    [selectContactState],
    (contactState) => contactState?.status || 'idle'
);

export default contactSlice.reducer;
