import { configureStore } from "@reduxjs/toolkit"
import userReducer from './userSlice'
import roleReducer from './roleSlice'
import iotDataReducer from './iotDataSlice'

const appStore = configureStore({
    reducer:{
        user:userReducer,
        role:roleReducer,
        iotData:iotDataReducer,
    }
})

export default appStore;