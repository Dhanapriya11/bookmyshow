document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    setupBookingForm();
});

async function loadMovies() {
    try {
        const response = await fetch('http://localhost:5000/api/movies');
        const movies = await response.json();
        displayMovies(movies);
        populateMovieSelect(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <h3>${movie.title}</h3>
            <p>Genre: ${movie.genre}</p>
            <p>Duration: ${movie.duration}</p>
        </div>
    `).join('');
}

function populateMovieSelect(movies) {
    const select = document.getElementById('movie-select');
    select.innerHTML = movies.map(movie => 
        `<option value="${movie.id}">${movie.title}</option>`
    ).join('');
}

function setupBookingForm() {
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const movieId = document.getElementById('movie-select').value;
        const seats = document.getElementById('seats').value;
        
        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ movieId: parseInt(movieId), seats: parseInt(seats) })
            });
            const result = await response.json();
            alert(result.message);
            form.reset();
        } catch (error) {
            console.error('Error booking:', error);
            alert('Booking failed');
        }
    });
}