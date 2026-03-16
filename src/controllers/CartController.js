const cartSchema = require("../models/CartModel")

const createCart = async(req,res)=>{
    try{
        const savedCart = await cartSchema.create(req.body)
        res.status(201).json({
            message:"create cart successfully..",
            data:savedCart
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating cart..",
            err:err
        })
    }
}

const getAllCart = async(req,res)=>{
    try{
        const allCart = await cartSchema.find()
        .populate("user_id")
        .populate("items.product_id")
        res.status(200).json({
            message:"cart fetching successfully",
            data:allCart
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching cart..",
            err:err
        })
    }
}

const getCartById = async(req,res)=>{
    try{
        const foundCart = await cartSchema.findById(req.params.id)
        .populate("user_id")
        .populate("items.product_id")
        res.status(200).json({
            message:"cart fetching successfully",
            data:foundCart
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching cart..",
            err:err
        })
    }
}

const updateCart = async(req,res)=>{
    try{
        const updateObj = await cartSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"cart update successfully",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating cart..",
            err:err
        })
    }
}

const deleteCart = async(req,res)=>{
    try{
        const deleteObj = await cartSchema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message:"cart deleting successfully",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting cart..",
            err:err
        })
    }
}


module.exports = {
    createCart,
    getAllCart,
    getCartById,
    updateCart,
    deleteCart
}