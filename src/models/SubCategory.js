const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        maxlength:30
    },

    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:true
    },

    created_at:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("subcategories",subCategorySchema);