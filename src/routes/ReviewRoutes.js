const express = require('express');
const router = express.Router();
const { addReview, getAllReviews, deleteReview, getProductReviews } = require('../controllers/ReviewController');
const validateToken = require("../middleware/AuthMiddleware")

// User routes
router.post('/add', validateToken, addReview);


router.get('/product/:id', getProductReviews);
// Admin routes
router.get('/all', getAllReviews); 
router.delete('/delete/:id', deleteReview);

module.exports = router;