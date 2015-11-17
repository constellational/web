var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './main.js'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'main.js',
  },
  module: {
    loaders: [{loader: 'uglify'}, {
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
};

