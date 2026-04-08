const router = require("express").Router()
const orderController = require("../controllers/OrderController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/order",validateToken,orderController.createOrder)
router.get("/orders",validateToken,orderController.getAllOrder)
router.get("/order",validateToken,orderController.getMyOrder)
router.put("/order/:id",validateToken,orderController.cancelOrder)
router.get("/order/:id", validateToken, orderController.getOrderById);
router.get("/recent-order", validateToken, orderController.getRecentPendingOrders);

router.delete("/order/:id", validateToken, orderController.deleteOrder);
router.put("/order/status/:id", validateToken, orderController.updateOrderStatus);
module.exports = router
