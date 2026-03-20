const cartSchema = require("../models/CartModel")



const createCart = async (req, res) => {
    try {
        // validateToken માંથી આપણને req.user._id મળશે
        const userId = req.user._id; 
        const { product_id, quantity } = req.body;

        // ૧. ચેક કરો કે આ યુઝરનું કાર્ટ પહેલેથી છે કે નહીં
        let cart = await cartSchema.findOne({ user_id: userId });

        if (cart) {
            // ૨. જો કાર્ટ હોય, તો ચેક કરો કે આ પ્રોડક્ટ અંદર છે?
            const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);

            if (itemIndex > -1) {
                // જો પ્રોડક્ટ હોય, તો ફક્ત ક્વોન્ટિટી વધારો
                cart.items[itemIndex].quantity += Number(quantity) || 1;
            } else {
                // જો પ્રોડક્ટ ના હોય, તો નવી એડ કરો
                cart.items.push({ product_id, quantity: quantity || 1 });
            }
            await cart.save();
        } else {
            // ૩. જો કાર્ટ જ ના હોય, તો નવું કાર્ટ બનાવો
            cart = await cartSchema.create({
                user_id: userId,
                items: [{ product_id, quantity: quantity || 1 }]
            });
        }

        res.status(201).json({ message: "Product added to cart", data: cart });
    } catch (err) {
        res.status(500).json({ message: "Error adding to cart", err: err.message });
    }
};

const getAllCart = async (req, res) => {
    try {
        // ૧. ચેક કરો કે ટોકનમાંથી યુઝર આઈડી મળે છે કે નહીં
        const userId = req.user._id;

        // ૨. તે યુઝરનું કાર્ટ શોધો અને પ્રોડક્ટની વિગતો 'populate' કરો
        const allCart = await cartSchema.find({ user_id: userId })
            .populate("items.product_id"); 

        res.status(200).json({
            message: "Cart fetching successfully",
            data: allCart
        });
    } catch (err) {
        console.log("Backend Error:", err);
        res.status(500).json({
            message: "Error while fetching cart..",
            err: err.message
        });
    }
}

const getCartById = async(req,res)=>{
    try{
        const foundCart = await cartSchema.findById(req.params.id)
        .populate("user_id")
        .populate("items.product_id")
        res.status(200).json({
            message:"cart fetching successfully",
            data:foundCart
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching cart..",
            err:err
        })
    }
}

const updateCart = async(req,res)=>{
    try{
        const updateObj = await cartSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json({
            message:"cart update successfully",
            data:updateObj
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating cart..",
            err:err
        })
    }
}

const deleteCart = async (req, res) => {
    try {
        const userId = req.user._id; // Token માંથી મળેલી ID
        const productId = req.params.id; // Route માંથી મળેલી ID (:id)

        // ૧. યુઝરનું કાર્ટ શોધો
        let cart = await cartSchema.findOne({ user_id: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // ૨. તે પ્રોડક્ટને લિસ્ટમાંથી કાઢી નાખો
        // ખાસ ધ્યાન રાખજો: item.product_id ને .toString() કરવું જરૂરી છે
        const updatedItems = cart.items.filter(
            (item) => item.product_id.toString() !== productId
        );

        // ૩. અપડેટ કરેલું લિસ્ટ ફરીથી સેવ કરો
        cart.items = updatedItems;
        await cart.save();

        res.status(200).json({ 
            message: "Item removed successfully", 
            data: cart 
        });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ 
            message: "Server error while deleting item", 
            error: err.message 
        });
    }
};

module.exports = {
    createCart,
    getAllCart,
    getCartById,
    updateCart,
    deleteCart
}