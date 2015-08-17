var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

var api = require('./api');
var views = require('./views');
var user = require('./user');
var React = require('react');
var Promise = require('bluebird');

var load = function(username, id) {
  return api(username, id).then(function(data) => {
    React.render(React.createElement(views.Articles, data), document.body);
  });
};

exports.handler = function(event, context) {
  console.log(event);
  load(event.username, event.id).then(() => {
  
  }).catch(err => {
  
  });
};
