const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: './functions/server.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'functions-dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: 'raw-loader'
      }
    ]
  }
};