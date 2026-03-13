const router = require("express").Router()
const paymentController = require("../controllers/PaymentController")

router.post("/payment",paymentController.createPayment)
router.get("/payments",paymentController.getAllPayment)
router.get("/payment/:id",paymentController.getPaymentById)
router.put("/payment/:id",paymentController.updatePayment)
router.delete("/payment/:id",paymentController.deletePayment)

module.exports = router