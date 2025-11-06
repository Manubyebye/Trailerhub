const TMDB_API_KEY = '458506a259414a02caf8b52422e9df8d';

async function loadWeirdMovies() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=14,27,53,878&sort_by=popularity.desc`
        );
        const data = await response.json();
        displayWeirdMovies(data.results);
    } catch (error) {
        console.error('Error loading weird movies:', error);
        document.getElementById('moviesGrid').innerHTML = 
            '<div class="no-results"><h3>Error loading weird movies</h3></div>';
    }
}

function displayWeirdMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<div class="no-results"><h3>No weird movies found</h3></div>';
        return;
    }

    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card weird-card" onclick="viewMovie(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                 alt="${movie.title}" 
                 onerror="this.src='https://via.placeholder.com/500x750/333/fff?text=No+Image'">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>
                    ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'} 
                    • ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
                <div class="weird-badge">Weird</div>
            </div>
        </div>
    `).join('');
}

function viewMovie(movieId) {
    window.location.href = `/movie.html?id=${movieId}`;
}

document.addEventListener('DOMContentLoaded', loadWeirdMovies);