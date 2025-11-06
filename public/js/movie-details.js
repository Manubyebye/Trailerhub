const TMDB_API_KEY = '458506a259414a02caf8b52422e9df8d';

async function loadMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        window.location.href = '/';
        return;
    }

    try {
        const [movieResponse, videosResponse] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`),
            fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`)
        ]);
        
        const movie = await movieResponse.json();
        const videos = await videosResponse.json();
        const trailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        
        displayMovieDetails(movie, trailer);
    } catch (error) {
        console.error('Error loading movie:', error);
        document.getElementById('movieContent').innerHTML = `
            <div class="no-results">
                <h3>Error loading movie</h3>
                <a href="/">← Back to Home</a>
            </div>
        `;
    }
}

function displayMovieDetails(movie, trailer) {
    const movieContent = document.getElementById('movieContent');
    
    movieContent.innerHTML = `
        ${trailer ? `
            <div class="trailer-container">
                <h3>Watch Trailer: ${movie.title}</h3>
                <iframe 
                    width="100%" 
                    height="500" 
                    src="https://www.youtube.com/embed/${trailer.key}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
            </div>
        ` : `
            <div class="no-trailer">
                <h3>No trailer available for ${movie.title}</h3>
            </div>
        `}
        
        <div class="movie-info-detail">
            <div class="poster-section">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                     alt="${movie.title}" 
                     onerror="this.style.display='none'">
            </div>
            <div class="details-section">
                <h1>${movie.title}</h1>
                <div class="movie-meta">
                    <span class="rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    <span class="year">${movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
                    ${movie.runtime ? `<span class="runtime">${movie.runtime} min</span>` : ''}
                </div>
                <p class="overview">${movie.overview || 'No description available.'}</p>
                ${movie.genres && movie.genres.length > 0 ? `
                    <div class="genres">
                        ${movie.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadMovieDetails);