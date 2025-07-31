import { configureStore } from "@reduxjs/toolkit"
import userReducer from './userSlice'
import roleReducer from './roleSlice'

const appStore = configureStore({
    reducer:{
        user:userReducer,
        role:roleReducer,
    }
})

export default appStore;