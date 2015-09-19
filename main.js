var USER_URL = 'https://s3.amazonaws.com/constellational-store';
var POST_URL = 'https://d2nxl7qthm5fu1.cloudfront.net';
require("babel/register");
var views = require('./lambda/views');
var React = require('react');

var splitPathname = window.location.pathname.split('/');
let username = splitPathname.shift();
let id = splitPathname.shift(); 

function fetchUser(username) {
  return fetch(USER_URL + '/' + username).then(res => res.json());
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + url).then(res => res.json());
}

function load(username, id) {
  return fetchUser(username).then(function(user) {
    if ((id) && (user.posts.indexOf(id) > 0)) {
      user.posts.splice(user.posts.indexOf(id), 1);
      user.posts.unshift(id);
    }
    var promiseArr = user.posts.map(id => fetchPost(username, id));
    Promise.All(promiseArr).then((data) => {
      let mountNode = document.getElementById("react-mount");
      React.render(React.createElement(views.User, data), mountNode);
    });
  });
}

load(username, id);
