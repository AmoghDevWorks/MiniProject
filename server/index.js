const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/db')
const adminRoutes = require('./routes/admin')

const app = express();

app.use(cors());
app.use(express.json());

dbConnect()

app.use('/admin',adminRoutes)

app.listen(8000,()=>{
    console.log('backend running in the port 8000')
})