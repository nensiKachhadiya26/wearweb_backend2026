require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())

const DBConnection = require("./src/utils/DBConnection")
DBConnection()

const userRoutes = require("./src/routes/UserRoutes")
app.use("/userApi",userRoutes)

const productRoutes = require("./src/routes/ProductRoutes")
app.use("/productApi",productRoutes)

const categoryRoutes = require("./src/routes/CategoryRoutes")
app.use("/categoryApi",categoryRoutes)

const subCategoryRoutes = require("./src/routes/SubCategoryRoutes")
app.use("/subCategoryApi",subCategoryRoutes)

const orderRoutes = require("./src/routes/OrderRoutes")
app.use("/orderApi",orderRoutes)

const orderItemRoutes = require("./src/routes/OrderItemRoutes")
app.use("/orderItemApi",orderItemRoutes)

const cartRoutes = require("./src/routes/CartRoutes")
app.use("/cartApi",cartRoutes)

const paymentRoutes = require("./src/routes/PaymentRoutes")
app.use("/paymentApi",paymentRoutes)

const reviewRoutes = require("./src/routes/ReviewRoutes");
app.use('/reviewApi', reviewRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})