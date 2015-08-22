var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

var views = require('./views');
var api = require('./api');
var React = require('react');

var generateHTML = function(data) {
  var cssSrc = staticURL + '/style.css';
  var scriptSrc = staticURL + '/main.js';
  var reactString = React.renderToString(React.createElement(views.Articles, data));
  return "<html><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><meta name='viewport' content='width=device-width, initial-scale=1' /><link rel='stylesheet' type='text/css' href='" + cssSrc + "'><body>" + reactString + "</body><script src='" + scriptSrc + "'></script></html>";
};

exports.handler = function(event, context) {
  console.log(event);
  api(event.username, event.id).then(generateHTML).then(context.succeed).catch(context.fail);
};
