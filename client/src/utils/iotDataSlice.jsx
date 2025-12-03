import { createSlice } from "@reduxjs/toolkit";

const iotData = createSlice({
    name:'iotData',
    initialState:null,
    reducers:{
        addIoT:(state,action)=>{
            return action.payload
        },
        removeIoT:()=>{
            return null
        }
    }
})

export const { addIoT,removeIoT } = iotData.actions
export default iotData.reducer