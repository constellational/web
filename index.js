var JS_URL = '/main.js';
var CSS_URL = '/style.css';
var USER_URL = 'https://s3.amazonaws.com/constellational-store';
var POST_URL = 'https://d2nxl7qthm5fu1.cloudfront.net';

require("babel-core/register");
var serve = require('koa-static');
var koa = require('koa');
var fetch = require('node-fetch');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var views = require('./views');

var app = koa();
var port = process.env.PORT || 3000;

function generateHTML(user) {
  var contentType = "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
  var viewport = "<meta name='viewport' content='width=device-width, initial-scale=1' />";
  var stylesheet = "<link rel='stylesheet' type='text/css' href='" + CSS_URL + "'>";
  var head = contentType + viewport + stylesheet;
  var reactString = ReactDOMServer.renderToString(React.createElement(views.User, user));
  var body = "<body><div id='react-mount'>" + reactString + "</div></body><script src='" + JS_URL + "'></script></html>";
  return "<html>" + head + body + "</html>";
}

function fetchUser(username) {
  return fetch(USER_URL + '/' + username).then(res => res.json());
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + '/' + url).then(res => res.json());
}

app.use(function *() {
  var splitURL = this.url.split('/');
  splitURL.shift();
  var username = splitURL.shift().toLowerCase();
  var id = splitURL.shift();
  var user = yield fetchUser(username).then((user) => {
    if ((id) && (user.posts.indexOf(id) > 0)) {
      user.posts.splice(user.posts.indexOf(id), 1);
      user.posts.unshift(id);
    }
    var promiseArr = user.posts.map(id => fetchPost(username, id));
    return Promise.all(promiseArr).then((data) => {
      user.posts = data;
      return user;
    });
  });
  this.body = generateHTML(user);
});
  
app.use(serve('public'));

app.listen(port);
