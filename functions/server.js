// functions/server.js - Use proper EJS with file system
const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();

// Add this near the top after express setup
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Configure EJS properly
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Serve static files - PUT THIS RIGHT AFTER express.urlencoded
app.use('/css', express.static(path.join(__dirname, '../public/css'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/js', express.static(path.join(__dirname, '../public/js'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use(express.static(path.join(__dirname, '../public')));

// Home route
app.get('/', async (req, res) => {
    try {
        let movies = [];
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
            );
            movies = response.data.results;
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
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
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
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=16&with_keywords=210024&sort_by=popularity.desc&page=1`
            );
            animeMovies = response.data.results;
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
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=14,27,878&sort_by=popularity.desc&page=1`
            );
            weirdMovies = response.data.results;
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
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
        if (TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_keywords=18035|9717|207317&sort_by=popularity.desc&page=1`
            );
            weedMovies = response.data.results;
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
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
        if (!TMDB_API_KEY) {
            return res.redirect('/');
        }

        const movieResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`
        );
        
        const movie = movieResponse.data;
        const trailer = movie.videos?.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        res.render('movie', { 
            movie: movie,
            trailer: trailer,
            searchQuery: ''
        });
        
    } catch (error) {
        console.error('Error fetching movie:', error.message);
        res.redirect('/');
    }
});

module.exports.handler = serverless(app);