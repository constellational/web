var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

var views = require('./views');
var api = require('./api');
var React = require('react');

var generateHTML = function(data) {
  var scriptSrc = staticURL + '/main.js';
  var reactString = React.renderToString(React.createElement(views.Articles, data));
  return "<html><body>" + reactString + "</body><script src='" + scriptSrc + "'></script></html>";
};

exports.handler = function(event, context) {
  console.log(event);
  api(event.username, event.id).then(generateHTML).then(context.succeed).catch(context.fail);
};
