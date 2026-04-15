const router = require("express").Router()
const cartController = require("../controllers/CartController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/cart", validateToken, cartController.createCart)
router.get("/carts", validateToken, cartController.getAllCart)
router.get("/cart/:id", cartController.getCartById)
router.put("/cart", cartController.updateCart)


router.delete("/clear", validateToken, cartController.clearCartAfterOrder)

router.delete("/cart/:id", validateToken, cartController.deleteCart)

module.exports = router