import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI } from '../services/api';
import './MovieSearchPage.css';

const MovieSearchPage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setFilteredMovies(movies);
      } else {
        try {
          setLoading(true);
          const response = await moviesAPI.searchMovies(searchQuery);
          setFilteredMovies(response.data);
        } catch (err) {
          setError(err.message || 'Failed to search movies');
          setFilteredMovies([]);
        } finally {
          setLoading(false);
        }
      }
    };
    performSearch();
  }, [searchQuery, movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getMovies();
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movie) => {
    navigate('/booking', { state: { movie } });
  };

  const handleGoToBookings = () => {
    navigate('/my-bookings');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) {
    return (
      <div className="movie-search-container">
        <div className="loading">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="movie-search-container">
      <header className="movie-header">
        <h1>BookMyShow</h1>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {user.name || 'User'}!</span>
          <button onClick={handleGoToBookings} className="logout-btn">
            My Bookings
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="movie-content">
        <div className="search-section">
          <h2>Search Movies</h2>
          <input
            type="text"
            placeholder="Search by movie name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="movies-grid">
          {filteredMovies.length === 0 ? (
            <div className="no-results">
              {searchQuery ? 'No movies found matching your search.' : 'No movies available.'}
            </div>
          ) : (
            filteredMovies.map((movie) => (
              <div key={movie._id} className="movie-card">
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <div className="locations">
                    <strong>Available in:</strong>
                    <div className="location-tags">
                      {movie.locations.map((location, index) => (
                        <span key={index} className="location-tag">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleMovieSelect(movie)}
                  className="book-btn"
                >
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieSearchPage;

