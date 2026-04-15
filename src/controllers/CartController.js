const cartSchema = require("../models/CartModel")



const createCart = async (req, res) => {
    try {
       
        const userId = req.user._id; 
        const { product_id, quantity } = req.body;

        let cart = await cartSchema.findOne({ user_id: userId });

        if (cart) {
                const itemIndex = cart.items.findIndex(item => 
                String(item.product_id).trim() === String(product_id).trim() ); 
           if (itemIndex > -1) {
                cart.items[itemIndex].quantity = Number(quantity) || 1; 
            } else {
                cart.items.push({ product_id, quantity: quantity || 1 });
            }
            await cart.save();
        } else {
          
            cart = await cartSchema.create({
                user_id: userId,
                items: [{ product_id, quantity: quantity || 1 }]
            });
        }

        res.status(201).json({ message: "Product added to cart", data: cart });
    } catch (err) {
        res.status(500).json({ message: "Error adding to cart", err: err.message });
    }
};

const getAllCart = async (req, res) => {
    try {
     
        const userId = req.user._id;

     
        const allCart = await cartSchema.find({ user_id: userId })
            .populate("items.product_id"); 

        res.status(200).json({
            message: "Cart fetching successfully",
            data: allCart
        });
    } catch (err) {
        console.log("Backend Error:", err);
        res.status(500).json({
            message: "Error while fetching cart..",
            err: err.message
        });
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

const deleteCart = async (req, res) => {
    try {
        const userId = req.user._id; 
        const productId = req.params.id; 

     
        let cart = await cartSchema.findOne({ user_id: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

      
        const updatedItems = cart.items.filter(
            (item) => item.product_id.toString() !== productId
        );

       
        cart.items = updatedItems;
        await cart.save();

        res.status(200).json({ 
            message: "Item removed successfully", 
            data: cart 
        });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ 
            message: "Server error while deleting item", 
            error: err.message 
        });
    }
};

const clearCartAfterOrder = async (req, res) => {
    try {
        const userId = req.user._id;
       
        await cartSchema.findOneAndDelete({ user_id: userId });
        
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error clearing cart", err: err.message });
    }
};
module.exports = {
    createCart,
    getAllCart,
    getCartById,
    updateCart,
    deleteCart,
    clearCartAfterOrder
}