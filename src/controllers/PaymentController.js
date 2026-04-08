const Razorpay = require("razorpay");
const crypto = require("crypto");
const paymentSchema = require("../models/PaymentModel");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

// 1. Create Order
exports.createRazorPayOrder = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount) * 100, // INR to Paise
            currency: "INR",
            receipt: "order_rcptid_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Verify Payment
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isVerified = expectedSignature === razorpay_signature;

    // Database Entry
    await paymentSchema.create({
        paymentId: "PAY-" + Date.now(),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: amount,
        currency: "INR",
        status: isVerified ? "success" : "failed"
    });

    if (isVerified) {
        res.status(200).json({ success: true, message: "Verified" });
    } else {
        res.status(400).json({ success: false, message: "Invalid Signature" });
    }
};