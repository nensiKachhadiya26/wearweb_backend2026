const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({

    order_id:{
        type:mongoose.Types.ObjectId,
        ref:"orders",
        required:true
    },

    items:[
        {
            product_id:{
                type:mongoose.Types.ObjectId,
                ref:"products",
                required:true
            },

            quantity:{
                type:Number,
                required:true
            },

            price:{
                type:Number,
                required:true
            }
    }
]

})

module.exports = mongoose.model("orderitems",orderItemSchema)