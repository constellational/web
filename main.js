var API_URL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
require("babel/register");
var API = require('./lambda/api');
var api = new API(API_URL);
var views = require('./lambda/views');
var React = require('react');

var splitPathname = window.location.pathname.split('/');
let username = splitPathname.shift();
let articleID = splitPathname.shift(); 

function load(username, id) {
  return api(username, id).then((data) => {
    let mountNode = document.getElementById("react-mount");
    React.render(React.createElement(views.Articles, data), mountNode);
  });
}

load(username, articleID);
