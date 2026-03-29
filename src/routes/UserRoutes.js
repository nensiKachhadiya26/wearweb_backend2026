const router = require("express").Router()
const userController = require("../controllers/UserController")
const validateToken = require("../middleware/AuthMiddleware")
router.post("/register",userController.registerUser)
router.get("/getuser",userController.getAllUser)
router.delete("/user/:id",userController.deleteUser)
router.put("/user/:id",userController.updateUser)
router.post("/login",userController.loginUser)
router.get("/admin/status", userController.getDashboardStatus);
router.get("/getsellers", userController.getAllSellers);
router.post("/forgotpassword",userController.forgotPassword)
router.get("/view-sales", validateToken, userController.getAllSalesForAdmin);
module.exports = router
