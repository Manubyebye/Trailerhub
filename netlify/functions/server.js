const express = require('express');
const serverless = require('serverless-http');

// Import your main app
const mainApp = require('../../server.js');

// Create wrapper app
const app = express();
app.use('/', mainApp);

// Export for Netlify
module.exports.handler = serverless(app);