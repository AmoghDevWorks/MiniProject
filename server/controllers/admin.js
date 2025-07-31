const adminModel = require('../models/admin')
const bcrypt = require('bcrypt')

const signUp = async(req,res,next) => {
    const { name,email,password,phoneNo } = req.body

    adminModel.findOne({email:email})
    .then(user=>{
        if(user){
            return res.status(404).json({data:'User exists'})
        }

        return bcrypt.hash(password,10)
    })
    .then(hashedPassword=>{
        if(!hashedPassword){
            return res.status(500).json({data:"Internal server Error"})
        }

        const newAdmin = new adminModel({
            name:name,
            email:email,
            password:hashedPassword,
            phoneNo:phoneNo
        })

        console.log(newAdmin)

        return newAdmin.save()
    })
    .then(savedUser=>{
        if(!savedUser){
            return res.status(500).json({data:'Unable to add - server error'})
        }

        return res.status(200).json({msg:'SignUp successfull',data:savedUser})
    })
    .catch(e=>{
        return res.status(500).json({data:'internal server error'})
    })
}

const signIn = async(req,res,next) => {
    const { email,password } = req.body;
    let userData;

    adminModel.findOne({email:email})
    .then((user)=>{
        if(!user){
            return res.status(404).json({data:"Invalid email"})
        }

        userData = user
        return bcrypt.compare(password,user.password)
    })
    .then((passwordMatch)=>{
        if(!passwordMatch){
            return res.status(404).json({data:"Invalid credentials"})
        }

        return res.status(200).json({msg:'sign In successfull',data:userData})
    })
    .catch(e=>{
        return res.status(500).json({data:'Internal Server Error'})
    })
}

module.exports = { signUp,signIn }