const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // તમારા User મોડેલનું નામ
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', 
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    images: [{ type: String }],
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

module.exports = mongoose.model('reviews', reviewSchema);