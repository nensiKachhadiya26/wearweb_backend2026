const categorySchema = require("../models/CategoryModel")

const createCategory = async(req,res)=>{
    try{
        const savedCategory = await categorySchema.create(req.body)
        res.status(201).json({
            message:"category create successfully",
            data:savedCategory
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating categories",
            err:err
        })
    }
}

const getAllCategory = async(req,res) => {
    try{
        const allCategory = await categorySchema.find()
        res.status(201).json({
            message:"show all category",
            data:allCategory
        })
    }catch(err){
        res.status(500).json({
            message:"error while get all category",
            err:err
        })
    }
}

const getCategoryById = async(req,res) =>{
    try{
        const foundCategory = await categorySchema.findById(req.params.id)
        res.status(201).json({
            message:"category found successfully",
            data:foundCategory
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching category ",
            err:err
        })
    }
}

const updateCategory = async(req,res)=>{
    try{
        const updateObj = await categorySchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"category updated successfully",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while update category..",
            err:err
        })
    }
}
const deleteCategory = async(req,res)=>{
    try{
        const deleteObj = await categorySchema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message:"delete category successfully",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while delete category..",
            err:err
        })
    }
}
module.exports = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
}