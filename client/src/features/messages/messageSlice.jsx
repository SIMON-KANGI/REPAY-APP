import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async () => {
    const response = await axios.get('http://127.0.0.1:5555/chat/messages',{
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
    });
    return response.data;
});

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        addReply: (state, action) => {
            const { messageId, reply } = action.payload;
            const message = state.messages.find((msg) => msg.id === messageId);
            if (message) {
                message.replies.push(reply);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addMessage, addReply } = messageSlice.actions;

export const selectMessagesState = (state) => state.message; // Adjusted to match `message` key

export const selectCurrentMessages = createSelector(
    [selectMessagesState],
    (messagesState) => messagesState?.messages || []
);

export const selectCurrentStatus = createSelector(
    [selectMessagesState],
    (messagesState) => messagesState?.status || 'idle'
);

export const selectError = createSelector(
    [selectMessagesState],
    (messagesState) => messagesState?.error
);

export default messageSlice.reducer;
