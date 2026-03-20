const productSchema = require("../models/ProductModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")


const createProduct = async(req, res) => {
    try {
        
        if (!req.user) {
            return res.status(401).json({ message: "Login required to create product" });
        }

        const file = req.file; 
        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

       
        const cloudinaryResponse = await uploadToCloudinary(file.path);
        
        
        const savedProduct = await productSchema.create({
            ...req.body,
            sellerId: req.user._id, 
            image: cloudinaryResponse.secure_url
        });

        res.status(201).json({
            message: "product create successfully..",
            data: savedProduct
        });

    } catch(err) {
        console.log("Error details:", err);
        res.status(500).json({
            message: "error while creating product",
            err: err.message 
        });
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
const getMyProducts = async (req, res) => {
    try {
        // અહીં req.user._id ત્યારે જ મળશે જો validateToken મિડલવેર ચાલતું હોય
        const myProducts = await productSchema.find({
            sellerId: req.user._id 
        })
        .populate("categoryId", "name")
        .populate("subCategoryId", "name");

        res.status(200).json({
            message: "product show successfully",
            data: myProducts
        });
    } catch (err) {
        res.status(500).json({
            message: "error while fetching product",
            error: err.message
        });
    }
};
module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts
}