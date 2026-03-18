const router = require("express").Router()
const productController = require("../controllers/ProductController")
const upload  = require("../middleware/UploadMiddleware")

router.post("/product",upload.any("image"),productController.createProduct)
router.get("/products",productController.getAllProduct)
router.get("/product/:id",productController.getProductById)
router.put("/product/:id",productController.updateProduct)
router.delete("/product/:id",productController.deleteProduct)
module.exports = router;