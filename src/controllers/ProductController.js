const productSchema = require("../models/ProductModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")



const createProduct = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ err: "Empty file" });

       
        const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

        const savedProduct = await productSchema.create({
            ...req.body,
            sellerId: req.user._id,
            image: [cloudinaryResponse.secure_url], 
            status: "pending"
        });

        res.status(201).json({ message: "Success", data: savedProduct });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
const getAllProduct = async(req,res)=>{
    try{
        const allProduct = await productSchema.find({ status: "approved" })
        .populate("categoryId" , "name")
        .populate("subCategoryId")
        .populate("sellerId")
        res.status(200).json({
            message:"get all approve product data",
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

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const loggedInSellerId = req.user._id;

        const product = await productSchema.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        
        if (product.sellerId.toString() !== loggedInSellerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized: You can only update your own products"
            });
        }

        let updateData = { ...req.body };

        if (req.file) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);
            updateData.image = [cloudinaryResponse.secure_url]; 
        }

        const updateObj = await productSchema.findByIdAndUpdate(
            productId, 
            updateData, 
            { new: true }
        );

        res.status(200).json({
            message: "product updated successfully",
            data: updateObj
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({
            message: "error while update product..",
            err: err.message
        });
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
const getPendingProducts = async (req, res) => {
    const products = await productSchema.find({ status: 'pending' }).populate('sellerId', 'firstName lastName email');
    console.log("Pending Products with Seller:", JSON.stringify(products, null, 2));
    res.json({ success: true, data: products });
};

const updateProductStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status: 'approved' or 'rejected'
    await productSchema.findByIdAndUpdate(id, { status });
    res.json({ success: true, message: `Product ${status} successfully!` });
};
module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts,
    getPendingProducts,
    updateProductStatus
}