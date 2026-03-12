const orderSchema = require("../models/OrderModel")

const createOrder = async(req,res)=>{
    try{
        const savedOrder = await orderSchema.create(req.body)
        res.status(201).json({
            message:"order create successfully",
            data:savedOrder
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating order..",
            err:err
        })
    }
}

const getAllOrder = async(req,res)=>{
    try{
        const allOrder = await orderSchema.find()
        res.status(201).json({
            message:"show all order data",
            data:allOrder
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching order..",
            err:err
        })
    }
}

const getOrderById = async(req,res)=>{
    try{
        const foundOrder = await orderSchema.findById(req.params.id)
        res.status(201).json({
            message:"order found successfully",
            data:foundOrder
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching order..",
            err:err
        })
    }
}

const updateOrder = async(req,res)=>{
    try{
        const updateObj = await orderSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"order update successfully",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating order..",
            err:err
        })
    }
}

const deleteOrder = async(req,res)=>{
    try{
        const deleteObj = await orderSchema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message:"order delete successfully",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting order..",
            err:err
        })
    }
}
module.exports = {
    createOrder,
    getAllOrder,
    getOrderById,
    updateOrder,
    deleteOrder
}