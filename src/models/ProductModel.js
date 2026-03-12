const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        maxlength:50
    },

    price:{
        type:Number,
        required:true
    },

    description:{
        type:String,
        maxlength:200
    },

    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:true
    },

    subCategoryId:{
        type:mongoose.Types.ObjectId,
        ref:"SubCategory",
        required:true
    },

    sellerId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },

    image:{
        type:String,
        maxlength:255
    },

    stock:{
        type:Number,
        default:0
    },

    created_at:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("products",productSchema)