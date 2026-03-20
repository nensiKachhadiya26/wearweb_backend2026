const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtils")
const jwt = require("jsonwebtoken")
const secret = "secret"

//registrations...
const registerUser = async(req,res)=>{
    try{
        // const isApproved = role === "user" ? true : false;
        const hashedPassword =  await bcrypt.hash(req.body.password,10)
        const savedUser = await userSchema.create({...req.body,password:hashedPassword})
        
            await mailSend(savedUser.email, `
            <div style="text-align:center">
                <h2>Welcome to our Website</h2>
                <img src="https://yourwebsite.com/welcome.png" width="400"/>
                <p>Thank you for registering with our app.</p>
            </div>
            `);
        res.status(201).json({
            message:"user created successfully",
            data:savedUser
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating user",
            err:err
        })
    }
}
    
const getAllUser = async(req,res)=>{
    try{
        const allUser = await userSchema.find()
        res.status(200).json({
                message:"all user data ",
                data:allUser
        })
    }catch(err){
        res.status(500).json({
                message:"error while fetching all user data",
                err:err
        })
    }
}

const deleteUser = async(req,res)=>{
    try{
        const deleteObj = await userSchema.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"user deleted..",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"user not deleted..",
            err:err
        })
    }
}

const updateUser = async(req,res)=>{
    try{
        if(req.body.password){req.body.password = await bcrypt.hash(req.body.password,10)}
        const updateObj = await userSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json({
            message:"user data updated..",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"user data not updated..",
            err:err
        })
    }  
}
//login....
const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body
        const foundUserFromEmail = await userSchema.findOne({email:email})
        if(foundUserFromEmail){
            const isPasswordMatched = await bcrypt.compare(password,foundUserFromEmail.password)
            if(isPasswordMatched){
                const token = jwt.sign(foundUserFromEmail.toObject(),secret)
                res.status(200).json({
                    message:"Login Successfully..",
                    // data:foundUserFromEmail,
                    token:token,
                    role:foundUserFromEmail.role
                })
            }
            else{
                res.status(401).json({
                    message:"Invalid Credentials.."
                })
            }
        } else{
            res.status(404).json({
                message:"User Not Found."
            })
        }
    }catch(err){
        res.status(500).json({
            message:"error while creating user",
            err:err
        })
    }
}

module.exports = {
    registerUser,
    getAllUser,
    deleteUser,
    updateUser,
    loginUser,
}