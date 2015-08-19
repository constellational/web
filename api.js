var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

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
    if (id) {
      var i = user.articles.indexOf(id);
      if (i != -1) {
        user.articles.splice(i, 1);
	user.articles.unshift(id);
      }
    }
    var promiseArr = user.articles.map(function(id) {
      return fetchArticle(username, id);
    });
    return Promise.all(promiseArr);
  }).then(function(articles) {
    user.articles = articles;
    return user;
  });
}

exports = fetchData;
