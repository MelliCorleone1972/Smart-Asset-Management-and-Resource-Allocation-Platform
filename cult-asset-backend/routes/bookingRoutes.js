const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Consumer Routes
router.post('/', verifyToken, createBooking);
router.get('/my-history', verifyToken, getUserBookings);

// Admin Routes
router.get('/', verifyToken, isAdmin, getAllBookings);
router.put('/:id/status', verifyToken, isAdmin, updateBookingStatus);

module.exports = router;
