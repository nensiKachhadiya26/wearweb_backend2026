const orderSchema = require("../models/OrderModel")
const orderItemSchema = require("../models/OrderItemModel")
const cartSchema = require("../models/CartModel");

const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("User ID from Token:", userId); 

        const cart = await cartSchema.findOne({ user_id: userId }).populate("items.product_id");
        console.log("Cart Found:", cart); 

        if (!cart || !cart.items || cart.items.length === 0) {
            console.log("Cart is empty or not found!"); 
            return res.status(400).json({ message: "Your Cart Is Empty!" });
        }

        const newOrder = await orderSchema.create({
            user_id: userId,
            total_amount: req.body.total_amount, 
            
            order_status: "Pending"
        });

        await orderItemSchema.create({
            order_id: newOrder._id,
            items: cart.items.map(item => ({
                product_id: item.product_id?._id,
                quantity: item.quantity,
                price: item.product_id.price || 0
                
            }))
        });

        await cartSchema.findOneAndDelete({ user_id: userId });

        res.status(201).json({ 
            message: "Order placed successfully! 🎉", 
            orderId: newOrder._id 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const getAllOrder = async(req,res)=>{
    try{
        const allOrder = await orderSchema.find()
        res.status(200).json({
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
        res.status(200).json({
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