const subCategorySchema = require("../models/SubCategory")


const createSubCategory = async(req,res)=>{
    try{
        const savedSubCategory = await subCategorySchema.create(req.body)
        res.status(201).json({
            message:"create subcategory successfully",
            data:savedSubCategory
        })
    }catch(err){
        res.status(500).json({
            message:"error while create subcategory",
            err:err
        })
    }
}

const getAllSubCategory= async(req,res)=>{
    try{
        const allSubCategory = await subCategorySchema.find()
        res.status(201).json({
            message:"subcategory fetching successfully",
            data:allSubCategory
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching subcategory..",
            err:err
        })
    }
}

const getSubCategoryById = async(req,res)=>{
    try{
        const foundSubCategory = await subCategorySchema.findById(req.params.id)
        res.status(201).json({
            message:"found subcategory successfully",
            data:foundSubCategory
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching subcategory",
            err:err
        })
    }
}

const updateSubCategory = async(req,res)=>{
    try{
        const updateObj = await subCategorySchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"update subcategory successfully",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating subcategory",
            err:err
        })
    }
} 

const deleteSubCategory = async(req,res)=>{
    try{
        const deleteObj = await subCategorySchema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message:"delete subcategory successfully",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting subCategory..",
            err:err
        })
    }
}
module.exports = {
    createSubCategory,
    getAllSubCategory,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory

}