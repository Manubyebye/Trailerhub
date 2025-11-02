require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
    try {
        let movies = [];
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
            );
            movies = response.data.results;
            console.log('🏠 Homepage loaded with', movies.length, 'movies from TMDB');
        }
        
        res.render('index', { 
            title: 'TrailerHub - Latest Movie Trailers',
            movies: movies,
            searchQuery: '',
            searchResults: null
        });
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.render('index', { 
            title: 'TrailerHub - Latest Movie Trailers',
            movies: [],
            searchQuery: '',
            searchResults: null
        });
    }
});

// Search route
app.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.q || '';
        let searchResults = [];
        
        if (searchQuery.trim() !== '' && TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1&include_adult=false`
            );
            searchResults = response.data.results;
        }
        
        res.render('index', {
            title: `Search: ${searchQuery} - TrailerHub`,
            movies: [],
            searchQuery: searchQuery,
            searchResults: searchResults
        });
        
    } catch (error) {
        console.error('Search error:', error.message);
        res.render('index', {
            title: 'TrailerHub - Search',
            movies: [],
            searchQuery: req.query.q || '',
            searchResults: []
        });
    }
});

// Anime route
app.get('/anime', async (req, res) => {
    try {
        let animeMovies = [];
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=16&with_keywords=210024&sort_by=popularity.desc&page=1`
            );
            animeMovies = response.data.results;
            console.log('🎌 Anime page loaded with', animeMovies.length, 'movies from TMDB');
        }
        
        res.render('anime', {
            title: 'Anime Movies - TrailerHub',
            animeMovies: animeMovies,
            searchQuery: ''
        });
        
    } catch (error) {
        console.error('Error fetching anime movies:', error.message);
        res.render('anime', {
            title: 'Anime Movies - TrailerHub',
            animeMovies: [],
            searchQuery: ''
        });
    }
});

// Weird route
app.get('/weird', async (req, res) => {
    try {
        let weirdMovies = [];
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=14,27,878&sort_by=popularity.desc&page=1`
            );
            weirdMovies = response.data.results;
            console.log('🔮 Weird page loaded with', weirdMovies.length, 'movies from TMDB');
        }
        
        res.render('weird', {
            title: 'Weird & Super Freak Movies - TrailerHub',
            weirdMovies: weirdMovies,
            searchQuery: ''
        });
        
    } catch (error) {
        console.error('Error fetching weird movies:', error.message);
        res.render('weird', {
            title: 'Weird & Super Freak Movies - TrailerHub',
            weirdMovies: [],
            searchQuery: ''
        });
    }
});

// Weed route
app.get('/weed', async (req, res) => {
    try {
        let weedMovies = [];
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_keywords=18035|9717|207317&sort_by=popularity.desc&page=1`
            );
            weedMovies = response.data.results;
            console.log('🌿 Weed page loaded with', weedMovies.length, 'movies from TMDB');
        }
        
        res.render('weed', {
            title: 'Weed & Smoke Movies - TrailerHub',
            weedMovies: weedMovies,
            searchQuery: ''
        });
        
    } catch (error) {
        console.error('Error fetching weed movies:', error.message);
        res.render('weed', {
            title: 'Weed & Smoke Movies - TrailerHub',
            weedMovies: [],
            searchQuery: ''
        });
    }
});

// Movie detail route
app.get('/movie/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        
        if (!TMDB_API_KEY) {
            console.log('❌ No TMDB API key - cannot fetch movie details');
            return res.redirect('/');
        }

        console.log(`🎬 Fetching movie details for ID: ${movieId}`);
        
        const movieResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`
        );
        
        const movie = movieResponse.data;
        
        const trailer = movie.videos?.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        console.log(`✅ Loaded movie: ${movie.title} | Trailer: ${trailer ? 'Yes' : 'No'}`);
        
        res.render('movie', { 
            movie: movie,
            trailer: trailer,
            searchQuery: ''
        });
        
    } catch (error) {
        console.error('❌ Error fetching movie:', error.message);
        console.error('Movie ID that failed:', req.params.id);
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`🎬 TrailerHub running at http://localhost:${PORT}`);
    if (TMDB_API_KEY) {
        console.log('✅ Using TMDB API - Real movie data enabled');
    } else {
        console.log('❌ No TMDB API key found - Add your key to .env file');
    }
});

// Netlify requires this for proper routing
app.get('*', function(req, res) {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎬 TrailerHub running at http://localhost:${PORT}`);
    if (TMDB_API_KEY) {
      console.log('✅ Using TMDB API - Real movie data enabled');
    } else {
      console.log('❌ No TMDB API key found - Add your key to .env file');
    }
  });
}

module.exports = app;