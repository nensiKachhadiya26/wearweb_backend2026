const router = require("express").Router()
const userController = require("../controllers/UserController")
router.post("/register",userController.registerUser)
router.get("/getdata",userController.getAllUser)
module.exports = router