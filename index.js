'use strict'

var USER_URL = 'https://s3.amazonaws.com/constellational-users';
var POST_URL = 'https://d2gs3048w5buml.cloudfront.net';

require("babel-core/register");
var koa = require('koa');
var serve = require('koa-static');
var render = require('koa-ejs');
var fetch = require('node-fetch');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var views = require('./views');

var app = koa();
var port = process.env.PORT || 3000;

function fetchUser(username) {
  return fetch(USER_URL + '/' + username).then((res) => {
    if (res.status != 200) this.throw();
    else return res.json();
  });
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + '/' + url).then(res => res.json());
}

render(app, {root: 'templates'});

app.use(serve('public'));

app.use(function *() {
  let splitURL = this.url.split('/');
  splitURL.shift();
  let username = splitURL.shift().toLowerCase();
  let id = splitURL.shift();
  let user = {};
  yield fetchUser(username).catch(() => {
    this.throw('Couldn\'t find that user!', 404);
  }).then((u) => {
    user = u;
    return user.posts.map(id => fetchPost(username, id));
  }).then(Promise.all).then((data) => {
    user.posts = data;
  }).then(() => {
    let reactString = ReactDOMServer.renderToString(React.createElement(views.User, user));
    this.render('layout', {react: reactString});
  });
});
  
app.listen(port);
