const productSchema = require("../models/ProductModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")


const createProduct = async(req,res) => {
    try{
       console.log("req.files:", req.files);
       console.log("req.body:", req.body);
       // const savedProduct = await productSchema.create(req.body)
       const file = req.files[0]; 
       const cloudinaryResponse = await uploadToCloudinary(file.path)
       console.log("cloudinaryResponse",cloudinaryResponse)
       const savedProduct = await productSchema.create({...req.body,image:cloudinaryResponse.secure_url})
        res.status(201).json({
            message:"product create successfully..",
            data:savedProduct
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating product",
            err:err
        })
    }
}

const getAllProduct = async(req,res)=>{
    try{
        const allProduct = await productSchema.find()
        .populate("categoryId" , "name")
        .populate("subCategoryId")
        .populate("sellerId")
        res.status(200).json({
            message:"get all product data",
            data:allProduct
        })
    }catch(err){
         console.log(err) 
        res.status(500).json({
            message:"error while get all product data..",
            err:err
        })
    }
}

const getProductById = async(req,res)=>{
    try{
        const foundProduct = await productSchema.findById(req.params.id)
        .populate("categoryId")
        .populate("subCategoryId")
        .populate("sellerId")
        res.status(200).json({
            message:"product found",
            data:foundProduct
        })
    }catch(err){
        res.status(500).json({
            message:" error while fetching product",
            err:err
        })
    }
}

const updateProduct = async(req,res) => {
    try{
        const updateObj = await productSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"product updated",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while update product..",
            err:err
        })
    }
}

const deleteProduct = async(req,res)=>{
    try{
        const deleteObj = await productSchema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message:"product delete",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"product not deleted..",
            err:err
        })
    }
}
module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct
}