const mongoose = require('mongoose')

// for IoT 
const deviceRequestSchema = new mongoose.Schema({
    time: { type: String, default: () => new Date().toLocaleTimeString() },
    date: { type: String, default: () => new Date().toLocaleDateString() },
    allottedTechnician: { type: Boolean, default:false },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    workCompleted: { type: Boolean, default:false }
}, { _id: false });

// for user disease detection management
const imageProcessRequestSchema = new mongoose.Schema({
    date: { type: String, default: ()=> new Date().toLocaleDateString() },
    result: { type: String, required: true },
    confidence: { type: String, required: true},
    RAG_Response: { type: String, required: true}
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
    IoTDeviceId:{
        type: String,
        default: null
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
