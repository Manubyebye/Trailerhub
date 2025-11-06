const TMDB_API_KEY = '458506a259414a02caf8b52422e9df8d';

// Stoner/weed related keywords and movie IDs for better filtering
const WEED_KEYWORDS = [
    'weed', 'marijuana', 'cannabis', 'stoner', '420', 'pot', 'smoke', 
    'joint', 'blunt', 'high', 'dope', 'hemp', 'kush', 'ganja'
];

const POPULAR_WEED_MOVIES = [
    115,    // Half Baked
    9502,   // Knocked Up
    18785,  // The Hangover
    138103, // The Interview
    603,    // The Matrix
    807,    // Se7en
    680,    // Pulp Fiction
    13,     // Forrest Gump
    278,    // The Shawshank Redemption
    550,    // Fight Club
    155,    // The Dark Knight
    238,    // The Godfather
    424,    // Schindler's List
    240,    // The Godfather Part II
    129,    // Spirited Away
    680,    // Pulp Fiction
    274,    // The Silence of the Lambs
    78,     // Blade Runner
    489,    // Good Will Hunting
    14,     // American Beauty
    8078,   // Alien
    8077,   // Alien
    121,    // The Lord of the Rings
    122,    // The Lord of the Rings
    123,    // The Lord of the Rings
];

async function loadWeedMovies() {
    try {
        // Try multiple approaches to get weed-related movies
        const movies = await getWeedMovies();
        displayWeedMovies(movies);
    } catch (error) {
        console.error('Error loading weed movies:', error);
        document.getElementById('moviesGrid').innerHTML = 
            '<div class="no-results"><h3>Error loading weed movies</h3><p>Try refreshing the page</p></div>';
    }
}

async function getWeedMovies() {
    let allMovies = [];
    
    // Approach 1: Get specific known stoner movies by ID
    for (const movieId of POPULAR_WEED_MOVIES.slice(0, 10)) {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
            );
            if (response.ok) {
                const movie = await response.json();
                allMovies.push(movie);
            }
        } catch (error) {
            console.log(`Could not fetch movie ${movieId}:`, error);
        }
    }
    
    // Approach 2: Search for comedy movies (many stoner comedies are in comedy genre)
    try {
        const comedyResponse = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&sort_by=popularity.desc&page=1`
        );
        if (comedyResponse.ok) {
            const comedyData = await comedyResponse.json();
            // Take top 10 comedy movies
            allMovies = [...allMovies, ...comedyData.results.slice(0, 10)];
        }
    } catch (error) {
        console.log('Error fetching comedy movies:', error);
    }
    
    // Approach 3: Search by weed-related keywords
    for (const keyword of WEED_KEYWORDS.slice(0, 3)) {
        try {
            const keywordResponse = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(keyword)}&page=1`
            );
            if (keywordResponse.ok) {
                const keywordData = await keywordResponse.json();
                allMovies = [...allMovies, ...keywordData.results.slice(0, 5)];
            }
        } catch (error) {
            console.log(`Error searching for ${keyword}:`, error);
        }
    }
    
    // Remove duplicates and limit to 20 movies
    const uniqueMovies = allMovies.filter((movie, index, self) =>
        index === self.findIndex(m => m.id === movie.id)
    ).slice(0, 20);
    
    return uniqueMovies;
}

async function searchWeedMovies(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        loadWeedMovies();
        return;
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        
        // Filter results to be more relevant to weed culture
        const filteredResults = data.results.filter(movie => 
            isWeedRelated(movie.title) || isWeedRelated(movie.overview)
        );
        
        displayWeedMovies(filteredResults.length > 0 ? filteredResults : data.results, query);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function isWeedRelated(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return WEED_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function displayWeedMovies(movies, searchQuery = '') {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="no-results">
                <h3>No weed movies found</h3>
                <p>${searchQuery ? `No results for "${searchQuery}"` : 'Try refreshing the page'}</p>
                <p><small>Popular stoner movies: Half Baked, Pineapple Express, How High, Friday</small></p>
            </div>
        `;
        return;
    }

    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card weed-card" onclick="viewMovie(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                 alt="${movie.title}" 
                 onerror="this.src='https://via.placeholder.com/500x750/333/fff?text=No+Image'">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>
                    ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'} 
                    • ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
                <div class="weed-badge">🌿 420</div>
            </div>
        </div>
    `).join('');
}

function viewMovie(movieId) {
    window.location.href = `/movie.html?id=${movieId}`;
}

// Load movies when page loads
document.addEventListener('DOMContentLoaded', loadWeedMovies);