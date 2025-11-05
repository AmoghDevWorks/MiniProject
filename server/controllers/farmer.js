const farmermodel= require('../models/farmer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const farmerModel = require('../models/farmer');

const signUp = async(req,res)=>{
    const { name, email, password, phoneNo } = req.body;
    console.log(req.body)
    if(!name || !email || !password || !phoneNo) {
        return res.status(400).json({ data: 'All fields are required' });
    }
    try{
        const existingFarmer = await farmermodel.findOne({ email: email });
        if(existingFarmer){
            return res.status(400).json({ data: 'Farmer already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFarmer = new farmermodel({
            name: name,
            email: email,
            password: hashedPassword,
            phoneNo: phoneNo
        });
        await newFarmer.save();

        return res.status(200).json({ data: 'SignUp Successfull'})
    }
    catch(error){
        console.error('Error during signup:', error);
        return res.status(500).json({ data: 'Internal server error' });
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ data: "Email and password are required" });
    }

    try {
        const farmer = await farmermodel.findOne({ email });
        if (!farmer) {
            return res.status(404).json({ data: "Farmer not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, farmer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ data: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: farmer._id, email: farmer.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        res.cookie("authToken", token, {
            httpOnly: true, 
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({
            msg: "SignIn successful",
            data: farmer
        });

    } catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({ data: "Internal server error" });
    }
};

const saveDetectionData = async(req,res) => {
    try{
        const { farmerId,result, confidence, notes, recommendation } = req.body

        console.log(req.body)

        if(!farmerId){
            return res.status(404).json({ data:"Login Required" })
        }

        if(!result || !confidence || !notes || !recommendation){
            return res.status(404).json({ data:"Result and Confidence Not found" })
        }

        const value = parseFloat(confidence)
        const formattedConfidence = value*100

        const newData = {
            result,
            confidence : formattedConfidence,
            notes,
            recommendation
        }

        const updateFarmer = await farmerModel.findByIdAndUpdate(
            farmerId,
            { $push: { imageProcessRequests:newData } },
            { new: true }
        )

        if(!updateFarmer){
            return res.status(404).json({ success:false, data:"farmer Not Found" })
        }

        return res.status(200).json({ data : 'Detection Data saved successfully' })

    }catch(err){
        return res.status(500).json({ data : 'Internal Server Error' })
    }
}

const getPreviousDetections = async (req, res, next) => {
  const { farmerId } = req.params;

  if (!farmerId) {
    return res.status(400).json({ data: "Please login or provide a valid farmer ID." });
  }

  try {
    const farmerData = await farmerModel.findById(farmerId);

    if (!farmerData) {
      return res.status(404).json({ data: "Farmer not found." });
    }

    const detections = farmerData.imageProcessRequests || [];

    const sortedDetections = detections
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      detections: sortedDetections,
    });

  } catch (e) {
    return res.status(500).json({ data: "Internal Server Error" });
  }
};

module.exports ={signUp, signIn, saveDetectionData,getPreviousDetections };