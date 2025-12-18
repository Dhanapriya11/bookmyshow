const Movie = require('../models/Movie');
const mongoose = require('mongoose');

const DEFAULT_SHOWTIMES = ['10:00 AM', '1:30 PM', '4:30 PM', '7:30 PM'];

// Check MongoDB connection
const checkMongoConnection = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkMongoConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please start MongoDB and restart the server.'
      });
    }

    const movies = await Movie.find().sort({ title: 1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies.map((movie) => ({
        ...movie.toObject(),
        showtimes:
          movie.showtimes && movie.showtimes.length > 0
            ? movie.showtimes
            : DEFAULT_SHOWTIMES
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
      message: 'Error fetching movies',
      error: error.message
    });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkMongoConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please start MongoDB and restart the server.'
      });
    }

    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter q is required'
      });
    }

    // Search for movies containing the query (case-insensitive)
    const movies = await Movie.find({ title: new RegExp(q.trim(), 'i') });

    if (movies.length === 0) {
      // Create new movie if not found
      const newMovie = new Movie({
        title: q.trim(),
        locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']
      });
      await newMovie.save();
      movies.push(newMovie);
    }

    res.status(200).json({
      success: true,
      data: movies.map((movie) => ({
        ...movie.toObject(),
        showtimes:
          movie.showtimes && movie.showtimes.length > 0
            ? movie.showtimes
            : DEFAULT_SHOWTIMES
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
      message: 'Error searching movie',
      error: error.message
    });
  }
};

