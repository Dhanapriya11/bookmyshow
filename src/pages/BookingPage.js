import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [showDate, setShowDate] = useState('');
  const [seats, setSeats] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const defaultShowtimes = ['10:00 AM', '1:30 PM', '4:30 PM', '7:30 PM'];
  const pricePerSeat = 250;

  useEffect(() => {
    // Redirect if no movie selected
    if (!movie) {
      navigate('/movies');
    }
  }, [movie, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedLocation) {
      setError('Please select a location');
      return;
    }
    if (!selectedShowtime) {
      setError('Please select a showtime');
      return;
    }

    if (!showDate) {
      setError('Please select a date');
      return;
    }

    const seatsNum = parseInt(seats);
    if (!seats || seatsNum <= 0) {
      setError('Please enter a valid number of seats (minimum 1)');
      return;
    }

    if (seatsNum > 50) {
      setError('Maximum 50 seats can be booked at once');
      return;
    }

    try {
      setLoading(true);
      const response = await bookingsAPI.createBooking(
        movie._id,
        selectedLocation,
        seatsNum,
        selectedShowtime,
        showDate
      );

      // Navigate to confirmation page with booking details
      navigate('/confirmation', {
        state: {
          booking: response.data
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!movie) {
    return null;
  }

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1>Book Tickets</h1>

        <div className="movie-details">
          <h2>{movie.title}</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="location">Select Location</label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Choose a location</option>
              {movie.locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="showtime">Select Showtime</label>
            <select
              id="showtime"
              value={selectedShowtime}
              onChange={(e) => setSelectedShowtime(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Choose a showtime</option>
              {(movie.showtimes && movie.showtimes.length > 0
                ? movie.showtimes
                : defaultShowtimes
              ).map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <small className="form-hint">Times are for today.</small>
          </div>

          <div className="form-group">
            <label htmlFor="showDate">Select Date</label>
            <input
              type="date"
              id="showDate"
              className="form-input"
              value={showDate}
              onChange={(e) => setShowDate(e.target.value)}
              required
            />
            <small className="form-hint">Choose the date you will watch the movie.</small>
          </div>

          <div className="form-group">
            <label htmlFor="seats">Number of Seats</label>
            <input
              type="number"
              id="seats"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              min="1"
              max="50"
              className="form-input"
              placeholder="Enter number of seats (1-50)"
              required
            />
            <small className="form-hint">Minimum: 1, Maximum: 50</small>
          </div>

          <div className="form-group">
            <label>Payment</label>
            <div className="form-hint">Ticket price: ₹{pricePerSeat} per seat</div>
            <div className="form-hint">
              Total: ₹{seats ? parseInt(seats, 10) * pricePerSeat || 0 : 0}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/movies')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;

