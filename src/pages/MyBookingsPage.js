import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingsAPI.getMyBookings();
        setBookings(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBackToMovies = () => {
    navigate('/movies');
  };

  return (
    <div className="my-bookings-container">
      <header className="movie-header">
        <h1>My Bookings</h1>
        <div className="header-actions">
          <button onClick={handleBackToMovies} className="logout-btn">
            Back to Movies
          </button>
        </div>
      </header>

      <div className="my-bookings-content">
        {loading && <div className="loading">Loading your bookings...</div>}
        {error && !loading && <div className="error-message">{error}</div>}

        {!loading && !error && (
          bookings.length === 0 ? (
            <div className="no-bookings">You have no bookings yet.</div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.bookingId} className="booking-card">
                  <div className="booking-header-row">
                    <h2 className="booking-movie">{booking.movie}</h2>
                    <span className="booking-seats">{booking.seats} seat{booking.seats > 1 ? 's' : ''}</span>
                  </div>
                  <div className="booking-details-row">
                    <span className="booking-label">Location</span>
                    <span className="booking-value">{booking.location}</span>
                  </div>
                  {booking.showtime && (
                    <div className="booking-details-row">
                      <span className="booking-label">Showtime</span>
                      <span className="booking-value">{booking.showtime}</span>
                    </div>
                  )}
                  {booking.showDate && (
                    <div className="booking-details-row">
                      <span className="booking-label">Show Date</span>
                      <span className="booking-value">
                        {new Date(booking.showDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {typeof booking.totalAmount === 'number' && (
                    <div className="booking-details-row">
                      <span className="booking-label">Total</span>
                      <span className="booking-value">₹{booking.totalAmount}</span>
                    </div>
                  )}
                  <div className="booking-details-row">
                    <span className="booking-label">Booked On</span>
                    <span className="booking-value">
                      {new Date(booking.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
