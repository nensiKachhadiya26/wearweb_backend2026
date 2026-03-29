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
        ref:"categories",
        required:true
    },

    subCategoryId:{
        type:mongoose.Types.ObjectId,
        ref:"subcategories",
       // required:true
    },

    sellerId:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },

    image:[
        {
            type:String,
        }
    ],

    // stock:{
    //     type:Number,
    //     default:0
    // },

   sizes: [
        {
            type: String 
        }
    ],

    // color:{
    //     type:String,
    //     default:"Black",
    //     enum:["Red","Blue","Green","Yellow","Black"]
    // },

   status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    }

    // created_at:{
    //     type:Date,
    //     default:Date.now
    // }

} ,{ timestamps: true })

module.exports = mongoose.model("products",productSchema)