const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

    user_id:{
        type: mongoose.Types.ObjectId,
        ref: "users",
        required:true
    },

    total_amount:{
        type: Number,
        required: true
    },

    order_status:{
        type: String,
        enum:["Pending","Confirmed","Delivered"],
        default:"Pending"
    },

    order_date:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("orders", orderSchema)