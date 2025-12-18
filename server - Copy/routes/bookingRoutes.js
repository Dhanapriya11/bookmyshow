const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Booking routes (all require authentication)
router.post('/', auth, createBooking);
router.get('/my', auth, getMyBookings);

module.exports = router;

