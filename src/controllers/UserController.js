const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")


const registerUser = async(req,res)=>{
    
    try{
        const hashedPassword =  await bcrypt.hash(req.body.password,10)
        const savedUser = await userSchema.create({...req.body,password:hashedPassword})
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
module.exports = {
    registerUser,
    getAllUser,

}