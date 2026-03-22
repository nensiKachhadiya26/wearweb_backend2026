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
            image: cloudinaryResponse.secure_url,
            status: "pending" 
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

        // 1. પ્રોડક્ટ શોધો
        const product = await productSchema.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. માલિકી ચેક કરો
        if (product.sellerId.toString() !== loggedInSellerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized: You can only update your own products"
            });
        }

        // 3. અપડેટ કરવા માટેનો ડેટા તૈયાર કરો
        let updateData = { ...req.body };

        // 4. જો નવી ઈમેજ અપલોડ કરી હોય, તો તેને Cloudinary પર મોકલો
        if (req.file) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.path);
            updateData.image = cloudinaryResponse.secure_url; // Cloudinary URL સેવ કરો
        }

        // 5. ડેટાબેઝ અપડેટ કરો
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

// 2. પ્રોડક્ટનું સ્ટેટસ બદલવા માટે (Approve/Reject)
const updateProductStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status: 'approved' અથવા 'rejected'
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