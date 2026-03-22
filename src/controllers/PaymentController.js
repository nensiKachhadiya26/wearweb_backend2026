const paymentSchema = require("../models/PaymentModel")
const mongoose = require("mongoose");

const createPayment = async (req, res) => {
    try {
        console.log("Payment Data Received:", req.body); // આ ટર્મિનલમાં ચેક કરવા માટે છે

        const { order_id, payment_method, payment_status } = req.body;
        if (!order_id || !payment_method) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const savedPayment = await paymentSchema.create({
            order_id:new mongoose.Types.ObjectId(order_id),
            payment_method:payment_method,
            payment_status: payment_status || "Success"
        });

        res.status(201).json({
            message: "Payment data saved successfully",
            data: savedPayment
        });
    } catch (err) {
        console.error("Backend Payment Error:", err.message);
        res.status(500).json({
            message: "Internal Server Error in Payment",
            error: err.message
        });
    }
};

const getAllPayment = async(req,res)=>{
    try{
        const allPayment = await paymentSchema.find()
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
        const foundPayment = await paymentSchema.findById(req.params.id)
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
        const updateObj = await paymentSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
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
        const deleteObj = await paymentSchema.findByIdAndDelete(req.params.id)
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