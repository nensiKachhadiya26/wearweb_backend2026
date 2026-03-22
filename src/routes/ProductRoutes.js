const router = require("express").Router()
const productController = require("../controllers/ProductController")
const upload  = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")
router.post("/product",upload.single("image"),validateToken,productController.createProduct)
router.get("/products",validateToken,productController.getAllProduct)
router.get("/product/:id",productController.getProductById)
router.put("/product/:id",validateToken,upload.single("image"),productController.updateProduct)
router.delete("/product/:id",productController.deleteProduct)
 router.get("/admin/pending", validateToken, productController.getPendingProducts);
router.put("/admin/update-status/:id", validateToken, productController.updateProductStatus);
router.get("/my-products", validateToken, productController.getMyProducts);
module.exports = router;