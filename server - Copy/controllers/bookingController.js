const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

// Check MongoDB connection
const checkMongoConnection = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkMongoConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please start MongoDB and restart the server.'
      });
    }
    const { movieId, location, seats, showtime, showDate } = req.body;
    const userId = req.userId;

    // Validate input
    if (!movieId || !location || !seats || !showtime || !showDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movieId, location, seats, showtime, and showDate'
      });
    }

    // Validate seats
    if (seats <= 0 || seats > 50) {
      return res.status(400).json({
        success: false,
        message: 'Seats must be between 1 and 50'
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if location is available for this movie
    if (!movie.locations.includes(location)) {
      return res.status(400).json({
        success: false,
        message: 'Selected location is not available for this movie'
      });
    }

    const availableShowtimes =
      movie.showtimes && movie.showtimes.length > 0
        ? movie.showtimes
        : ['10:00 AM', '1:30 PM', '4:30 PM', '7:30 PM'];

    // Validate showtime for this movie
    if (!availableShowtimes.includes(showtime)) {
      return res.status(400).json({
        success: false,
        message: 'Selected showtime is not available for this movie'
      });
    }

    // Parse and validate show date (only date part is important)
    const selectedShowDate = new Date(showDate);
    if (Number.isNaN(selectedShowDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid show date'
      });
    }

    const pricePerSeat = 250; // simple fixed price per ticket
    const totalAmount = seats * pricePerSeat;

    // Create booking
    const booking = new Booking({
      userId,
      movieId,
      location,
      seats,
      showtime,
      showDate: selectedShowDate,
      totalAmount,
      paymentStatus: 'PAID'
    });

    await booking.save();

    // Populate movie details for response
    await booking.populate('movieId', 'title');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        bookingId: booking._id,
        movie: booking.movieId.title,
        location: booking.location,
        seats: booking.seats,
        showtime: booking.showtime,
        showDate: booking.showDate,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    // Handle MongoDB-specific errors
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please ensure MongoDB is running.',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkMongoConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please start MongoDB and restart the server.'
      });
    }

    const userId = req.userId;

    const bookings = await Booking.find({ userId })
      .populate('movieId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings.map(booking => ({
        bookingId: booking._id,
        movie: booking.movieId.title,
        location: booking.location,
        seats: booking.seats,
        showtime: booking.showtime,
        showDate: booking.showDate,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt
      }))
    });
  } catch (error) {
    // Handle MongoDB-specific errors
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please ensure MongoDB is running.',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

