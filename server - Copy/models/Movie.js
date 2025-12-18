const mongoose = require('mongoose');

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  locations: {
    type: [String],
    required: [true, 'At least one location is required'],
    validate: {
      validator: function(locations) {
        return locations && locations.length > 0;
      },
      message: 'Movie must have at least one location'
    }
  },
  showtimes: {
    type: [String],
    default: ['10:00 AM', '1:30 PM', '4:30 PM', '7:30 PM'],
    validate: {
      validator: function(showtimes) {
        return showtimes && showtimes.length > 0;
      },
      message: 'Movie must have at least one showtime'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);

