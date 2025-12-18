const express = require('express');
const router = express.Router();
const { getMovies, searchMovies } = require('../controllers/movieController');
const auth = require('../middleware/auth');

// Movie routes
router.get('/', auth, getMovies);
router.get('/search', auth, searchMovies);

module.exports = router;

