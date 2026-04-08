const mongoose = require("mongoose")
const schema = mongoose.Schema;

const paymentSchema = new schema({
    
        paymentId:{
            type:String,
            required:true
        },
        razorpayOrderId:{
            type:String,
            required:true
        },
        razorpayPaymentId:{
            type:String,
            required:true
        },
        razorpaySignature:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
        

},{timestamps:true})
module.exports = mongoose.model("payments",paymentSchema)