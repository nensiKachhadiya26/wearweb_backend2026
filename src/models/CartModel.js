const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
        
    },

    items:[{
            product_id:{
                type:mongoose.Types.ObjectId,
                ref:"products",
                required:true
            },

            quantity:{
                type:Number,
                default:0
            }
        }],

    added_at:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("carts",cartSchema)