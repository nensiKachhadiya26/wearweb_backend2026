const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtils")
const jwt = require("jsonwebtoken")
const secret = "secret"
const productSchema = require("../models/ProductModel")
const orderSchema = require("../models/OrderModel")
const orderItemSchema = require("../models/OrderItemModel")
const CloudinaryUtil = require("../utils/CloudinaryUtil")


//registrations...
const registerUser = async(req,res)=>{
    try{
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
//Login....
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
    const totalUsers = await userSchema.countDocuments({role:"user"});
    const totalProducts = await productSchema.countDocuments();
    const totalOrders = await orderSchema.countDocuments();

   
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
      const mailtext = `
            <div style="background-color: #f9f9f9; padding: 50px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <div style="background-color: #FF3F6C; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset</h1>
                    </div>
                    
                    <div style="padding: 40px; text-align: center;">
                        <p style="font-size: 18px; color: #333333; margin-bottom: 25px;">Hello,</p>
                        <p style="font-size: 16px; color: #666666; line-height: 1.6; margin-bottom: 30px;">
                            We received a request to reset your password. No changes have been made to your account yet. 
                            Click the button below to choose a new password:
                        </p>
                        
                        <a href="${url}" style="background-color: #FF3F6C; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 16px; transition: background-color 0.3s;">
                            Reset Password
                        </a>
                        
                        <p style="font-size: 14px; color: #999999; margin-top: 40px; line-height: 1.5;">
                            If you didn't request this, you can safely ignore this email. <br>
                            This link will expire soon for security reasons.
                        </p>
                    </div>
                    
                    <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        © 2026 Your Brand Name. All rights reserved.
                    </div>
                </div>
            </div>
            `;
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
             
                    select: 'firstName lastName' 
                }
            });

        const formattedSales = allSales.flatMap(group => {
            if (!group.order_id || !group.items) return [];

            return group.items.map(item => {
                const product = item.product_id;
                const seller = product?.sellerId;

                
                let fullName = "Unknown Seller";
                if (seller) {
                    const fName = seller.firstName || "";
                    const lName = seller.lastName || "";
                    fullName = (fName || lName) ? `${fName} ${lName}`.trim() : "Name Not Set";
                } else if (!product) {
                    fullName = "Product Deleted";
                }

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

        const decodedUser = await jwt.verify(token,secret) 
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


const getUserProfile = async (req, res) => {
    try {
        const user = await userSchema.findById(req.user._id).select("-password"); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};







const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        let imageUrl = "";

        if (req.file) {
            try {
                
                const result = await CloudinaryUtil(req.file.buffer); 
                imageUrl = result.secure_url;
            } catch (uploadErr) {
                console.error("Cloudinary Upload Error:", uploadErr);
                return res.status(500).json({ message: "Image upload failed" });
            }
        }

        const updateData = { firstName, lastName, email };
        if (imageUrl) updateData.profilePic = imageUrl;

 
        const updatedUser = await userSchema.findByIdAndUpdate(
            req.user._id, 
            updateData, 
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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
    resetPassword,
    getUserProfile,
    updateProfile
}