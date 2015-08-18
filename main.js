var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

var api = require('./api');
var views = require('./views');
var React = require('react');
var Promise = require('bluebird');

var splitPathname = window.location.pathname.split('/')[0];
var username = splitPathname[0];
var articleID = null; 
if (len(splitPathname) === 2) articleID = splitPathname[1];

function load(username, id) {
  return api(username, id).then(function(data) {
    React.render(React.createElement(views.Articles, data), document.body);
  });
};

load(username, articleID);
