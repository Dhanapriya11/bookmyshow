const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Check MongoDB connection
const checkMongoConnection = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

// Register User
exports.register = async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkMongoConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please start MongoDB and restart the server.'
      });
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
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
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkMongoConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please start MongoDB and restart the server.'
      });
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
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
      message: 'Error logging in',
      error: error.message
    });
  }
};

