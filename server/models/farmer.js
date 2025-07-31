const mongoose = require('mongoose')

const deviceRequestSchema = new mongoose.Schema({
    time: { type: String, default: () => new Date().toLocaleTimeString() },
    date: { type: String, default: () => new Date().toLocaleDateString() },
    allottedTechnician: { type: Boolean, default:false },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    workCompleted: { type: Boolean, default:false }
}, { _id: false });

const imageProcessRequestSchema = new mongoose.Schema({
    image: { type: String, required: true },
    result: { type: String, required: true },
    date: { type: String, default: ()=> new Date().toLocaleDateString() }
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
const farmerModel = mongoose.model('farmer', farmerSchema);
module.exports = farmerModel;
