const TMDB_API_KEY = '458506a259414a02caf8b52422e9df8d';

// Load popular movies
async function loadPopularMovies() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error loading movies:', error);
        document.getElementById('moviesGrid').innerHTML = 
            '<div class="no-results"><h3>Error loading movies</h3></div>';
    }
}

// Search movies
async function searchMovies(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        loadPopularMovies();
        return;
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        displayMovies(data.results, query);
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Display movies in grid
function displayMovies(movies, searchQuery = '') {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="no-results">
                <h3>No movies found</h3>
                <p>${searchQuery ? `No results for "${searchQuery}"` : 'Try refreshing the page'}</p>
            </div>
        `;
        return;
    }

    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="viewMovie(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                 alt="${movie.title}" 
                 onerror="this.src='https://via.placeholder.com/500x750/333/fff?text=No+Image'">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>
                    ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'} 
                    • ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
            </div>
        </div>
    `).join('');
}

// View movie details
function viewMovie(movieId) {
    window.location.href = `/movie.html?id=${movieId}`;
}

// Load movies when page loads
document.addEventListener('DOMContentLoaded', loadPopularMovies);