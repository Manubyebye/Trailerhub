// functions/server.js - Webpack compatible
const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const axios = require('axios');

const app = express();

// Import EJS properly for bundling
const ejs = require('ejs');

// Configure EJS
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Import your views as raw files
const indexView = require('../views/index.ejs');
const animeView = require('../views/anime.ejs');
const weedView = require('../views/weed.ejs');
const weirdView = require('../views/weird.ejs');
const movieView = require('../views/movie.ejs');

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
        
        // Render using the imported template
        const html = ejs.render(indexView, { 
            title: 'TrailerHub - Latest Movie Trailers',
            movies: movies,
            searchQuery: '',
            searchResults: null
        });
        res.send(html);
    } catch (error) {
        console.error('Error:', error.message);
        const html = ejs.render(indexView, { 
            title: 'TrailerHub - Latest Movie Trailers',
            movies: [],
            searchQuery: '',
            searchResults: null
        });
        res.send(html);
    }
});

// Add other routes similarly...

module.exports.handler = serverless(app);