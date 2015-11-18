require("babel-polyfill");
var USER_URL = 'https://s3.amazonaws.com/constellational-store';
var POST_URL = 'https://d2nxl7qthm5fu1.cloudfront.net';
var views = require('./views');
var React = require('react');

var splitPathname = window.location.pathname.split('/');
splitPathname.shift();
let username = splitPathname.shift().toLowerCase();
let id = splitPathname.shift();

function fetchUser(username) {
  return fetch(USER_URL + '/' + username).then(res => res.json());
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + '/' + url).then(res => res.json());
}

function load(username, id) {
  return fetchUser(username).then((user) => {
    if ((id) && (user.posts.indexOf(id) > 0)) {
      user.posts.splice(user.posts.indexOf(id), 1);
      user.posts.unshift(id);
    }
    var promiseArr = user.posts.map(id => fetchPost(username, id));
    Promise.all(promiseArr).then((data) => {
      user.posts = data;
      let mountNode = document.getElementById("react-mount");
      React.render(React.createElement(views.User, user), mountNode);
    });
  });
}

load(username, id);
