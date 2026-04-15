const reviewSchema = require('../models/ReviewModel');


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


const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewSchema.find()
            .populate('userId', 'firstName lastName email') 
            .populate('productId', 'name') 
            .sort({ createdAt: -1 });

        res.status(200).json({ data: reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        const { id } = req.params;
        const reviews = await reviewSchema.find({ productId: id })
            .populate('userId', 'firstName lastName')
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