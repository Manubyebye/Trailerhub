const TMDB_API_KEY = '458506a259414a02caf8b52422e9df8d';

async function loadAnimeMovies() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc`
        );
        const data = await response.json();
        displayAnimeMovies(data.results);
    } catch (error) {
        console.error('Error loading anime:', error);
        document.getElementById('moviesGrid').innerHTML = 
            '<div class="no-results"><h3>Error loading anime movies</h3></div>';
    }
}

async function searchAnime(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        loadAnimeMovies();
        return;
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&with_genres=16`
        );
        const data = await response.json();
        displayAnimeMovies(data.results, query);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displayAnimeMovies(movies, searchQuery = '') {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="no-results">
                <h3>No anime movies found</h3>
                <p>${searchQuery ? `No results for "${searchQuery}"` : 'Try refreshing the page'}</p>
            </div>
        `;
        return;
    }

    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card anime-card" onclick="viewMovie(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                 alt="${movie.title}" 
                 onerror="this.src='https://via.placeholder.com/500x750/333/fff?text=No+Image'">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>
                    ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'} 
                    • ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
                <div class="anime-badge">Anime</div>
            </div>
        </div>
    `).join('');
}

function viewMovie(movieId) {
    window.location.href = `/movie.html?id=${movieId}`;
}

document.addEventListener('DOMContentLoaded', loadAnimeMovies);