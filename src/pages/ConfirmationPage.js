import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    // Redirect if no booking data
    if (!booking) {
      navigate('/movies');
    }

    // Hide notification after 5 seconds
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [booking, navigate]);

  const handleBackToMovies = () => {
    navigate('/movies');
  };

  if (!booking) {
    return null;
  }

  return (
    <div className="confirmation-container">
      {showNotification && (
        <div className="success-notification">
          ✅ Booking confirmed successfully!
        </div>
      )}

      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>

        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Booking ID:</span>
            <span className="detail-value">{booking.bookingId}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Movie:</span>
            <span className="detail-value">{booking.movie}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{booking.location}</span>
          </div>

          {booking.showtime && (
            <div className="detail-row">
              <span className="detail-label">Showtime:</span>
              <span className="detail-value">{booking.showtime}</span>
            </div>
          )}

          {booking.showDate && (
            <div className="detail-row">
              <span className="detail-label">Show Date:</span>
              <span className="detail-value">
                {new Date(booking.showDate).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Number of Seats:</span>
            <span className="detail-value">{booking.seats}</span>
          </div>

          {typeof booking.totalAmount === 'number' && (
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">₹{booking.totalAmount}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Booking Date:</span>
            <span className="detail-value">
              {new Date(booking.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <button onClick={handleBackToMovies} className="back-btn">
          Back to Movies
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;

