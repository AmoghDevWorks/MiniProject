const mongoose = require('mongoose')
const deviceRequestSchema = new mongoose.Schema({
    time: { type: String, required: true },
    date: { type: String, required: true },
    allottedTechnician: { type: String, required: true },
    workCompleted: { type: Boolean, required: true }
}, { _id: false });

const imageProcessRequestSchema = new mongoose.Schema({
    image: { type: String, required: true },
    result: { type: String, required: true },
    date: { type: String, required: true }
}, { _id: false });
const farmerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    phoneNo:{
        type: Number,
        required: true,
    },
    profileImage:{
        type: String,
        required: false,
    },
    previousRequests: {
        type: [deviceRequestSchema],
        default: []
    },
    imageProcessRequests: {
        type: [imageProcessRequestSchema],
        default: []
    }
})