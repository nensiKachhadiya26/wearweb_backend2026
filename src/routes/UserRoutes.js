const router = require("express").Router()
const userController = require("../controllers/UserController")
router.post("/register",userController.registerUser)
router.get("/getuser",userController.getAllUser)
router.delete("/:id",userController.deleteUser)
router.put("/:id",userController.updateUser)
router.post("/login",userController.loginUser)
module.exports = router
