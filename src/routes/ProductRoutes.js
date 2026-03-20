const router = require("express").Router()
const productController = require("../controllers/ProductController")
const upload  = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")
router.post("/product",upload.single("image"),validateToken,productController.createProduct)
router.get("/products",validateToken,productController.getAllProduct)
router.get("/product/:id",productController.getProductById)
router.put("/product/:id",productController.updateProduct)
router.delete("/product/:id",productController.deleteProduct)
 router.get("/my-products",validateToken, productController.getMyProducts);
module.exports = router;