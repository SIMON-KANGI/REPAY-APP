import createSlice from '@reduxjs/toolkit'

const messageSlice= createSlice({
    name:"messages",
    initialState:{
        messages:[],
        status:"idle",
        error:null
    },
    reducers:{
        addMessage:(state,action)=>{
            state.messages.push(action.payload)
        },
        addReply:(state,action)=>{
            const {messageId, reply} = action.payload
            const message
        }
    }
})