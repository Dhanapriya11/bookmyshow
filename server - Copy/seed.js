const mongoose = require('mongoose');
require('dotenv').config();
const Movie = require('./models/Movie');

// Sample movie data
const sampleMovies = [
  {
    title: 'Avatar: The Way of Water',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    showtimes: ['10:00 AM', '1:30 PM', '4:30 PM', '8:00 PM']
  },
  {
    title: 'Pathaan',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'],
    showtimes: ['9:30 AM', '12:30 PM', '3:30 PM', '7:00 PM']
  },
  {
    title: 'RRR',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
    showtimes: ['11:00 AM', '2:30 PM', '6:30 PM', '9:30 PM']
  },
  {
    title: 'Top Gun: Maverick',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Kolkata'],
    showtimes: ['10:15 AM', '1:00 PM', '4:00 PM', '7:45 PM']
  },
  {
    title: 'KGF: Chapter 2',
    locations: ['Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'],
    showtimes: ['9:45 AM', '1:15 PM', '5:00 PM', '8:30 PM']
  },
  {
    title: 'Doctor Strange: Multiverse of Madness',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    showtimes: ['10:30 AM', '1:45 PM', '5:15 PM', '9:00 PM']
  },
  {
    title: 'Brahmastra',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'],
    showtimes: ['9:00 AM', '12:15 PM', '4:15 PM', '8:15 PM']
  },
  {
    title: 'The Batman',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    showtimes: ['11:15 AM', '2:45 PM', '6:15 PM', '9:45 PM']
  }
];

// Seed function
const seedMovies = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmyshow', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('🗑️  Cleared existing movies');

    // Insert sample movies
    const movies = await Movie.insertMany(sampleMovies);
    console.log(`✅ Seeded ${movies.length} movies successfully`);

    // Display seeded movies
    console.log('\n📽️  Seeded Movies:');
    movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} - Locations: ${movie.locations.join(', ')}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedMovies();

