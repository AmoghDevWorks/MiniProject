import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
    name:'role',
    initialState:null,
    reducers:{
        addRole:(state,action)=>{
            return action.payload
        },
        removeRole:()=>{
            return null
        }
    }
})

export const { addRole,removeRole } = roleSlice.actions
export default roleSlice.reducer