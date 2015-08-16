var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

var views = require('./views');
var React = require('react');
var Promise = require('bluebird');
var fetch = require('node-fetch');
fetch.Promise = Promise;

function fetchArticleList(username) {
  var url = apiURL + '/' + username;
  return fetch(url).then(function(res) {
    return res.json();
  });
}

function fetchArticle(username, id) {
  var url = apiURL + '/' + username + '/' + id;
  return fetch(url).then(function(res) {
    return res.json();
  });
}

function fetchData(username, id) {
  var user = {};
  return fetchArticleList(username).then(function(u) {
    user = u;
    var promiseArr = user.articles.map(function(id) {
      return fetchArticle(username, id);
    });
    return Promise.all(promiseArr);
  }).then(function(articles) {
    user.articles = articles;
    if (id) {};
    return user;
  });
}

var generateHTML = function(data) {
  var reactString = React.renderToString(React.createElement(views.Articles, data));
  return "<html><body>" + reactString + "</body><script src='/main.html'></script></html>";
};

exports.handler = function(event, context) {
  console.log(event);
  fetchData(event.username, event.id).then(generateHTML).then(context.succeed).catch(context.fail);
};
