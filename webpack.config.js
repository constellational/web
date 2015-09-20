var path = require('path');
var webpack = require('webpack');
var S3Plugin = require('webpack-s3-plugin');

module.exports = {
  entry: [
    './main.js'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'main.js',
  },
  module: {
    loaders: [{loader: 'babel'}],
    postloaders: [{loader: 'uglify'}]
  },
  plugins: [
    new S3Plugin({
      include: /.*\.(css|js)/,
      s3Options: {
        accessKeyId: process.env.S3_CONSTELLATIONAL_WEB_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_CONSTELLATIONAL_WEB_SECRET_ACCESS_KEY,
        region: 'us-east-1'
      },
      s3UploadOptions: {
        Bucket: 'constellational-web',
      }
    })
  ]
};

