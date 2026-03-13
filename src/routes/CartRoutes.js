const router = require("express").Router()
const cartController = require("../controllers/CartController")

router.post("/cart",cartController.createCart)
router.get("/carts",cartController.getAllCart)
router.get("/cart/:id",cartController.getCartById)
router.put("/cart",cartController.updateCart)
router.delete("/cart/:id",cartController.deleteCart)

module.exports = router