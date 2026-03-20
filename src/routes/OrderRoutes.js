const router = require("express").Router()
const orderController = require("../controllers/OrderController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/order",validateToken,orderController.createOrder)
router.get("/orders",orderController.getAllOrder)
router.get("/order/:id",orderController.getOrderById)
router.put("/order/:id",orderController.updateOrder)
router.delete("/order/:id",orderController.deleteOrder)
module.exports = router