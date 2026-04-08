const router = require("express").Router()
const cartController = require("../controllers/CartController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/cart", validateToken, cartController.createCart)
router.get("/carts", validateToken, cartController.getAllCart)
router.get("/cart/:id", cartController.getCartById)
router.put("/cart", cartController.updateCart)

// આ નવો રૂટ ઉમેર્યો: ઓર્ડર પછી આખું કાર્ટ ખાલી કરવા માટે
router.delete("/clear", validateToken, cartController.clearCartAfterOrder)

router.delete("/cart/:id", validateToken, cartController.deleteCart)

module.exports = router