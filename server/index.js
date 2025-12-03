const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/db')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const adminRoutes = require('./routes/admin')
const farmerRoutes = require('./routes/farmer')
const iotRoutes = require('./routes/iot')
const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.json());

dbConnect()

app.use('/iot',iotRoutes)
app.use('/admin',adminRoutes)
app.use('/farmer',farmerRoutes)
app.listen(8000,()=>{
    console.log('backend running in the port 8000')
})