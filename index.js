var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

var views = require('./views');
var React = require('react');
var Promise = require('bluebird');
var fetch = require('node-fetch');
fetch.Promise = Promise;

var fetchJSON = function(username, id) {
  var url = apiURL + '/' + username;
  if (id) url += '/' + id;
  return fetch(url).then(function(res) {
    return res.json();
  });
};

var generateHTML = function(json) {
  var reactString = React.renderToString(React.createElement(views.Blog, json));
  return "<html><body>" + reactString + "</body></html>";
};

exports.handler = function(event, context) {
  console.log(event);
  fetchJSON(event.username, event.id).then(generateHTML).then(context.succeed).catch(context.fail);
};
