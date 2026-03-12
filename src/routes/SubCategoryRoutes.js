const router = require("express").Router()
const subCategoryController = require("../controllers/SubCategoryController")

router.post("/subCategory",subCategoryController.createSubCategory)
router.get("/subCategories",subCategoryController.getAllSubCategory)
router.get("/subCategory/:id",subCategoryController.getSubCategoryById)
router.put("/subCategory/:id",subCategoryController.updateSubCategory)
router.delete("/subCategory/:id",subCategoryController.deleteSubCategory)

module.exports = router