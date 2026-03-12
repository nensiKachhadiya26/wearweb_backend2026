const router = require("express").Router()
const orderItemController = require("../controllers/OrderItemController")

router.post("/orderItem",orderItemController.createOrderItem)
router.get("/orderItems",orderItemController.getAllOrderItem)
router.get("/orderItem/:id",orderItemController.getOrderItemById)
router.put("/orderItem/:id",orderItemController.updateOrderItem)
router.delete("/orderItem/:id",orderItemController.deleteOrderItem)


module.exports = router