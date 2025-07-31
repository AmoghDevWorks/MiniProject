const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/db')
const adminRoutes = require('./routes/admin')
const farmerRoutes = require('./routes/farmer')
const app = express();

app.use(cors());
app.use(express.json());

dbConnect()

app.use('/admin',adminRoutes)
app.use('/farmer',farmerRoutes)
app.listen(8000,()=>{
    console.log('backend running in the port 8000')
})