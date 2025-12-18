// API Service - Handles all backend API calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle network errors
    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network connection errors
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to server. Please make sure the backend server is running on port 5000.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
};

// Movies API
export const moviesAPI = {
  getMovies: async () => {
    return apiRequest('/movies');
  },

  searchMovies: async (query) => {
    return apiRequest(`/movies/search?q=${encodeURIComponent(query)}`);
  }
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (movieId, location, seats, showtime, showDate) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({ movieId, location, seats, showtime, showDate })
    });
  },

  getMyBookings: async () => {
    return apiRequest('/bookings/my');
  }
};

