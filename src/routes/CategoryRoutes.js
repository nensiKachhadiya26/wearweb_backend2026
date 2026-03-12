const router = require("express").Router()
const categoryController = require("../controllers/CategoryController")

router.post("/category",categoryController.createCategory)
router.get("/categories",categoryController.getAllCategory)
router.get("/category/:id",categoryController.getCategoryById)
router.put("/category/:id",categoryController.updateCategory)
router.delete("/category/:id",categoryController.deleteCategory)
module.exports = router