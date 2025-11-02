const app = require('../../server.js');

exports.handler = async (event, context) => {
    return app(event, context);
};

// Netlify serverless compatibility
const serverless = require('serverless-http');

// Export for Netlify Functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = serverless(app);
}

// Local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🎬 TrailerHub running at http://localhost:${PORT}`);
    });
}