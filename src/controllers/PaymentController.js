const paymentschema = require("../models/PaymentModel")

const createPayment = async(req,res)=>{
    try{
        const savedPayment = await paymentschema.create(req.body)
        res.status(200).json({
            message:"payment create successfully..",
            data:savedPayment
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating payment..",
            err:err
        })
    }
}

const getAllPayment = async(req,res)=>{
    try{
        const allPayment = await paymentschema.find()
        res.status(200).json({
            message:"payment fetching successfully",
            data:allPayment
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching payment..",
            err:err
        })
    }
}

const getPaymentById = async(req,res)=>{
    try{
        const foundPayment = await paymentschema.findById(req.params.id)
        res.status(200).json({
            message:"payment fetching successfully",
            data:foundPayment
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching payment..",
            err:err
        })
    }
}

const updatePayment = async(req,res)=>{
    try{
        const updateObj = await paymentschema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"payment update successfully",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating payment..",
            err:err
        })
    }
}

const deletePayment = async(req,res)=>{
    try{
        const deleteObj = await paymentschema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message:"payment deleting successfully",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting payment..",
            err:err
        })
    }
}
module.exports = {
    createPayment,
    getAllPayment,
    getPaymentById,
    updatePayment,
    deletePayment
}