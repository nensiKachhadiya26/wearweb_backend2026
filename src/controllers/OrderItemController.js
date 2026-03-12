const orderItemSchema = require("../models/OrderItemModel")

const createOrderItem = async(req,res)=>{
    try{
        const savedOrderItem = await orderItemSchema.create(req.body)
        res.status(201).json({
            message:"create order item successfully",
            data:savedOrderItem
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating orderitem..",
            err:err
        })
    }
}

const getAllOrderItem = async(req,res)=>{
    try{
        const allOrderItem = await orderItemSchema.find()
        res.status(201).json({
            message:"orderitem fetching successfully",
            data:allOrderItem
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching all orderitem..",
            err:err          
        })
    }
}

const getOrderItemById = async(req,res)=>{
    try{
        const foundOrderItem = await orderItemSchema.findById(req.params.id)
        res.status(201).json({
            message:"orderitem found successfully",
            data:foundOrderItem
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching orderitem..",
            err:err
        })
    }
}

const updateOrderItem = async(req,res) =>{
    try{
        const updateObj = await orderItemSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"orderitem updating successfully",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating orderitem..",
            err:err
        })
    }
}

const deleteOrderItem = async(req,res)=>{
    try{
        const deleteObj = await orderItemSchema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message:"orderitem deleting successfully",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting orderitem..",
            err:err
        })
    }
}
module.exports = {
    createOrderItem,
    getAllOrderItem,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem
}