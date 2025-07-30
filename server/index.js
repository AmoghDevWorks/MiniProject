const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/db')

const app = express();

app.use(cors());
app.use(express.json());

dbConnect()

app.listen(8000,()=>{
    console.log('backend running in the port 8000')
})