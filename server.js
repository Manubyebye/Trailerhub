// Import ALL dependencies directly
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// Configure Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', async (req, res) => {
    try {
        let movies = [];
        if (process.env.TMDB_API_KEY) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
            );
            movies = response.data.results;
        }
        res.render('index', { 
            title: 'TrailerHub',
            movies: movies,
            searchQuery: '',
            searchResults: null
        });
    } catch (error) {
        res.render('index', { 
            title: 'TrailerHub',
            movies: [],
            searchQuery: '',
            searchResults: null
        });
    }
});

// Export for serverless
exports.handler = async (event, context) => {
    const { path: requestPath, httpMethod, headers, body } = event;
    
    return new Promise((resolve, reject) => {
        const req = {
            method: httpMethod,
            url: requestPath,
            headers: headers,
            body: body
        };
        
        const res = {
            statusCode: 200,
            headers: {},
            setHeader: function(key, value) {
                this.headers[key] = value;
            },
            end: function(data) {
                this.body = data;
                resolve({
                    statusCode: this.statusCode,
                    headers: this.headers,
                    body: this.body
                });
            },
            send: function(data) {
                this.end(data);
            },
            render: function(view, data) {
                // For now, send simple HTML
                this.setHeader('Content-Type', 'text/html');
                this.end(`
                    <html>
                    <head><title>TrailerHub</title></head>
                    <body>
                        <h1>TrailerHub - Express App</h1>
                        <p>Path: ${requestPath}</p>
                        <p>Movies functionality would be here</p>
                    </body>
                    </html>
                `);
            }
        };
        
        // Route the request
        if (requestPath === '/' || requestPath === '/index.html') {
            app.handle(req, res);
        } else {
            res.statusCode = 404;
            res.end('Page not found');
        }
    });
};