const mongoose = require('mongoose')

const dbConnect = () =>{
    mongoose.connect('mongodb://localhost:27017/farmer-app',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        console.log('database connection successfull');
    })
    .catch((e)=>{
        console.log('error connecting to db');
    })
}

module.exports = dbConnect