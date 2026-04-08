const orderSchema = require("../models/OrderModel")
const orderItemSchema = require("../models/OrderItemModel")
const cartSchema = require("../models/CartModel")

const createOrder = async (req, res) => {
    try {
        const userId = req.user._id; 
        // ફ્રન્ટએન્ડથી આવતા ડેટાનું સ્ટ્રક્ચર
        const { total_amount, cartItems, shippingAddress, fullName } = req.body; 

        if (!total_amount || !cartItems) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newOrder = new orderSchema({
            user_id: userId,
            total_amount: total_amount,
            shippingAddress: shippingAddress, 
            customer_name: fullName,
            order_status: "Pending"
        });

        const savedOrder = await newOrder.save();

        const newOrderItems = new orderItemSchema({
            order_id: savedOrder._id,
            items: cartItems.map(item => ({
                product_id: item.productId || item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        });

        await newOrderItems.save();
        await cartSchema.findOneAndDelete({ user_id: userId }); 

        res.status(201).json({ 
            message: "Order placed successfully! 🎉", 
            data: savedOrder, // ફ્રન્ટએન્ડ આ 'data' કી શોધે છે
            orderItems: newOrderItems
        });

    } catch (error) {
        res.status(500).json({ message: "Order failed", error: error.message });
    }
};

// સેલર ડેશબોર્ડ માટેના ઓર્ડર મેળવવા
const getAllOrder = async (req, res) => {
    try {
        const loggedInSellerId = req.user._id; // લૉગિન થયેલ સેલરની ID

        // ૧. પેલા 'OrderItem' ટેબલમાંથી એવા ઓર્ડર આઈડી (order_id) શોધો 
        // જેમાં પ્રોડક્ટનો sellerId લૉગિન થયેલ સેલર સાથે મેચ થતો હોય.
        const relevantOrderItems = await orderItemSchema.find().populate({
            path: 'items.product_id',
            match: { sellerId: loggedInSellerId }, // ફક્ત આ સેલરની પ્રોડક્ટ્સ જ ફિલ્ટર કરો
            select: 'sellerId'
        });

        // ૨. જે ઓર્ડરમાં આ સેલરની એક પણ પ્રોડક્ટ મળી હોય, તેના ID એક એરેમાં ભેગા કરો
        const sellerOrderIds = relevantOrderItems
            .filter(orderItem => orderItem.items.some(item => item.product_id !== null))
            .map(orderItem => orderItem.order_id);

        // ૩. હવે ફક્ત એ જ ઓર્ડર 'orderSchema' માંથી લાવો જે આ લિસ્ટમાં હોય
        const allOrder = await orderSchema.find({
            _id: { $in: sellerOrderIds }
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "success",
            data: allOrder
        });
    } catch (err) {
        console.error("Error in getAllOrder:", err);
        res.status(500).json({ message: "Error", err: err.message });
    }
}

const getMyOrder = async (req, res) => {
    try {
        const userId = req.user._id; 
        
        // ભૂલ સુધારો: 'userId' ને બદલે 'user_id' વાપરો (જે મોડેલમાં છે)
        const orders = await orderSchema.find({ user_id: userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            data: orders 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ... બાકીના ફંક્શન્સ (cancelOrder, deleteOrder) માં પણ 'user_id' વાપરવું
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        // અહીં પણ user_id કરો
        const order = await orderSchema.findOne({ _id: orderId, user_id: req.user._id });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.order_status = "Cancelled";
        await order.save();
        res.status(200).json({ message: "Order cancelled", data: order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const deleteObj = await orderSchema.findByIdAndDelete(req.params.id);
        if (!deleteObj) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({
            message: "order delete successfully",
            data: deleteObj
        });
    } catch (err) {
        res.status(500).json({
            message: "error while deleting order..",
            err: err.message
        });
    }
};
const getOrderById = async (req, res) => {
    try {
        // ૧. ઓર્ડર શોધો અને યુઝરની વિગતો મેળવો
        // ચેક કરો: તમારા સ્કીમામાં 'user' છે કે 'user_id'? જે હોય તે અહીં લખો.
        const order = await orderSchema.findById(req.params.id).populate("user_id", "firstName lastName email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // ૨. ઓર્ડર આઈટમ્સ શોધો અને પ્રોડક્ટની વિગતો populate કરો
        // ખાતરી કરો કે orderItemSchema માં 'product_id' ref આપેલી છે.
        const orderItems = await orderItemSchema.findOne({ order_id: order._id })
            .populate({
                path: 'items.product_id',
                select: 'name price image' // પ્રોડક્ટમાંથી આટલી જ વિગતો લેવી
            });

        res.status(200).json({
            success: true,
            data: {
                order,
                // ફ્રન્ટએન્ડમાં 'items' તરીકે મોકલીએ છીએ
                items: orderItems ? orderItems.items : []
            }
        });
    } catch (error) {
        console.error("Error in getOrderById:", error); // સર્વર ટર્મિનલમાં ભૂલ જોવા માટે
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { order_status } = req.body;
        const updatedOrder = await orderSchema.findByIdAndUpdate(
            req.params.id, 
            { order_status }, 
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getRecentPendingOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // ૧. પેલા એવા ઓર્ડર શોધો જેનું સ્ટેટસ "Pending" હોય
        const pendingOrders = await orderSchema.find({ 
            order_status: "Pending" 
        }).select("_id");

        const pendingOrderIds = pendingOrders.map(o => o._id);

        // ૨. હવે 'orderItemSchema' માં તપાસો કે આ Pending ઓર્ડરમાં આ સેલરની કઈ પ્રોડક્ટ છે
        const pendingItems = await orderItemSchema.find({
            order_id: { $in: pendingOrderIds }
        }).populate({
            path: 'items.product_id',
            match: { sellerId: sellerId }, // ફક્ત આ સેલરની પ્રોડક્ટ
            select: 'name'
        }).populate('order_id');

        // ૩. ડેટાને ફોર્મેટ કરો (બીજા સેલરની પ્રોડક્ટ ફિલ્ટર કરીને)
        const result = [];
        pendingItems.forEach(group => {
            group.items.forEach(item => {
                if (item.product_id) { // જો મેચ થાય તો જ
                    result.push({
                        order_id: group.order_id._id,
                        price: item.price,
                        product_name: item.product_id.name,
                        quantity: item.quantity,
                        status: group.order_id.order_status,
                        createdAt: group.order_id.createdAt
                    });
                }
            });
        });

        // છેલ્લા ઓર્ડર પહેલા બતાવવા માટે શોર્ટિંગ
        const finalData = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        res.status(200).json({ success: true, data: finalData });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


module.exports = {
    createOrder,
    getAllOrder,
    getMyOrder,
    cancelOrder,
    deleteOrder,
    getOrderById,
    updateOrderStatus,
    getRecentPendingOrders
}