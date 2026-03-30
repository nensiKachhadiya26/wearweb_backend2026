const reviewSchema = require('../models/ReviewModel');

// ૧. નવો રિવ્યૂ ઉમેરવા માટે (User Side)
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id || req.user._id;
        const newReview = new reviewSchema({
            userId,
            productId,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ message: "Review added successfully", data: newReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ૨. બધા રિવ્યૂ મેળવવા માટે (Admin Side)
const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewSchema.find()
            .populate('userId', 'firstName lastName email') // યુઝરનું નામ અને ઈમેઈલ લેવા
            .populate('productId', 'productName') // પ્રોડક્ટનું નામ લેવા
            .sort({ createdAt: -1 });

        res.status(200).json({ data: reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ૩. રિવ્યૂ ડિલીટ કરવા માટે (Admin Side)
const deleteReview = async (req, res) => {
    try {
        await reviewSchema.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { id } = req.params; // URL માંથી પ્રોડક્ટ ID લેશે
        const reviews = await reviewSchema.find({ productId: id })
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 });
        res.status(200).json({ data: reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addReview,
    deleteReview,
    getAllReviews,
    getProductReviews
}