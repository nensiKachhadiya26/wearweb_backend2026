const mongoose = require("mongoose"); 
const orderSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    total_amount: {
        type: Number,
        required: true
    },
    order_status: {
        type: String,
        enum: ["Pending", "Confirmed", "Delivered"],
        default: "Pending"
    }
   
}, { timestamps: true }); 

module.exports = mongoose.model("orders", orderSchema);