const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtils")
const jwt = require("jsonwebtoken")
const secret = "secret"
const productSchema = require("../models/ProductModel")
const orderSchema = require("../models/OrderModel")
const orderItemSchema = require("../models/OrderItemModel")

//registrations...
const registerUser = async(req,res)=>{
    try{
        // const isApproved = role === "user" ? true : false;
        const hashedPassword =  await bcrypt.hash(req.body.password,10)
        const savedUser = await userSchema.create({...req.body,password:hashedPassword})
        
            await mailSend(savedUser.email, `
            <div style="text-align:center">
                <h2>Welcome to our Website</h2>
                <img src="https://yourwebsite.com/welcome.png" width="400"/>
                <p>Thank you for registering with our app.</p>
            </div>
            `);
        res.status(201).json({
            message:"user created successfully",
            data:savedUser
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating user",
            err:err
        })
    }
}
    
const getAllUser = async(req,res)=>{
    try{
        const allUser = await userSchema.find({role: 'user'})
        res.status(200).json({
                message:"all user data ",
                data:allUser
        })
    }catch(err){
        res.status(500).json({
                message:"error while fetching all user data",
                err:err
        })
    }
}

const deleteUser = async(req,res)=>{
    try{
        const deleteObj = await userSchema.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"user deleted..",
            data:deleteObj
        })
    }catch(err){
        res.status(500).json({
            message:"user not deleted..",
            err:err
        })
    }
}

const updateUser = async(req,res)=>{
    try{
        if(req.body.password){req.body.password = await bcrypt.hash(req.body.password,10)}
        const updateObj = await userSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json({
            message:"user data updated..",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"user data not updated..",
            err:err
        })
    }  
}
//login....
const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body
        const foundUserFromEmail = await userSchema.findOne({email:email})
        if(foundUserFromEmail){
            const isPasswordMatched = await bcrypt.compare(password,foundUserFromEmail.password)
            if(isPasswordMatched){
                const token = jwt.sign(foundUserFromEmail.toObject(),secret)
                res.status(200).json({
                    message:"Login Successfully..",
                    // data:foundUserFromEmail,
                    token:token,
                    role:foundUserFromEmail.role
                })
            }
            else{
                res.status(401).json({
                    message:"Invalid Credentials.."
                })
            }
        } else{
            res.status(404).json({
                message:"User Not Found."
            })
        }
    }catch(err){
        res.status(500).json({
            message:"error while creating user",
            err:err
        })
    }
}

const getDashboardStatus = async (req, res) => {
  try {
    // 1. Counts melvo (Tame upar je variable name require karya che te j vapro)
    const totalUsers = await userSchema.countDocuments({role:"user"});
    const totalProducts = await productSchema.countDocuments();
    const totalOrders = await orderSchema.countDocuments();

    // 2. Revenue calculate karo
    // Tamari OrderModel ma field nu naam 'order_status' che ane enum ma 'Delivered' che.
    // Amount mate field nu naam 'total_amount' che.
    const orders = await orderSchema.find({ order_status: "Delivered" });
    
    const totalRevenue = orders.reduce((acc, curr) => {
        return acc + (curr.total_amount || 0);
    }, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Dashboard data fetch karvama bhul thai",
      error: error.message 
    });
  }
};

const getAllSellers = async (req, res) => {
    try {
       
        const allSellers = await userSchema.find({ role: "seller" });
        res.status(200).json({ success: true, data: allSellers });
    } catch (err) {
        res.status(500).json({ success: false, message: "error while fetching seller" });
    }
};

const forgotPassword = async(req,res)=>{
    console.log(req.body);
    const {email} = req.body;
    if(!email) return res.status(404).json({
        message:"email not provided.."
    })
    const foundUserFromEmail = await userSchema.findOne({email:email})
    if(foundUserFromEmail){
        const token = jwt.sign(foundUserFromEmail.toObject(),secret,{expiresIn:60*24*7})
        const url = `http://localhost:5173/ResetPassword/${token}`
         const mailtext = `<html>
            <a href ='${url}'>RESET PASSWORD</a>
        </html>`
        await mailSend(foundUserFromEmail.email,"Reset Password Link",mailtext)
        res.status(200).json({
            message:'reset password link sent to your email'
        })
     }
    else{
        res.status(404).json({
            message:"user not found.."
        })
    

    }
}
const getAllSalesForAdmin = async (req, res) => {
    try {
        const allSales = await orderItemSchema.find()
            .populate({
                path: 'order_id',
                model: 'orders',
                select: 'order_status createdAt'
            })
            .populate({
                path: 'items.product_id',
                model: 'products',
                select: 'name image sellerId price', 
                populate: { 
                    path: 'sellerId', 
                    model: 'users', 
                    // તમારા User Schema મુજબ આ ફિલ્ડ્સ હોવી જરૂરી છે
                    select: 'firstName lastName' 
                }
            });

        const formattedSales = allSales.flatMap(group => {
            if (!group.order_id || !group.items) return [];

            return group.items.map(item => {
                const product = item.product_id;
                const seller = product?.sellerId;

                // સેલરનું નામ બનાવવાનું લોજિક
                let fullName = "Unknown Seller";
                if (seller) {
                    // જો firstName અને lastName હોય તો તેને જોડો
                    const fName = seller.firstName || "";
                    const lName = seller.lastName || "";
                    fullName = (fName || lName) ? `${fName} ${lName}`.trim() : "Name Not Set";
                } else if (!product) {
                    fullName = "Product Deleted";
                }

                // અમાઉન્ટ લોજિક
                const unitPrice = Number(item.price || product?.price || 0);
                const qty = Number(item.quantity) || 1;

                return {
                    order_id: group.order_id._id,
                    date: group.order_id.createdAt,
                    product_name: product?.name || "Product Deleted",
                    product_image: (product?.image && Array.isArray(product.image)) ? product.image[0] : (product?.image || ""),
                    seller_name: fullName,
                    quantity: qty,
                    amount: unitPrice * qty,
                    status: group.order_id.order_status
                };
            });
        });

        res.status(200).json({ 
            success: true, 
            data: formattedSales 
        });

    } catch (err) {
        console.error("Master Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};


const resetPassword = async(req,res)=>{

    const {newPassword,token} = req.body;
    try{

        const decodedUser = await jwt.verify(token,secret) //{userobject}
        const hashedPassword =await  bcrypt.hash(newPassword,10)
        const updatedUser = await userSchema.findByIdAndUpdate(decodedUser._id,{password:hashedPassword})
        res.status(200).json({
            message:"password reset successfully !!",
        })


    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"server error..",
            err:err
        })
    }

}

module.exports = {
    registerUser,
    getAllUser,
    deleteUser,
    updateUser,
    loginUser,
    getDashboardStatus,
    getAllSellers,
    forgotPassword,
    getAllSalesForAdmin,
    resetPassword
}