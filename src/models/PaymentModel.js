const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({

    order_id:{
        type: mongoose.Types.ObjectId,
        ref: "orders",
        required:true
    },

    payment_method:{
        type: String,
        enum:["COD","UPI"],
        required: true
    },

    payment_status:{
        type: String,
        enum:["Success","Failed"],
        default:"Success"
    },

    payment_date:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("payments", paymentSchema)