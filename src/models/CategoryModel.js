const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        maxlength:20
    },
     status:{
        type:String,
        default:"active",
        enum:["active","inactive"]
    },

    created_at:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("categories",categorySchema);