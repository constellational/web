var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';
var STATIC_BUCKET_NAME = 'constellational-static';

require("babel/register");
var views = require('./views');
var React = require('react');
var Promise = require('bluebird');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
Promise.promisifyAll(Object.getPrototypeOf(s3));

function getObj(bucket, key) {
  console.log("Going to get " + key + " from " + bucket);
  var params = {Bucket: bucket, Key: key};
  return s3.getObjectAsync(params).then(function(data) {
    var s = new Buffer(data.Body).toString();
    return JSON.parse(s);
  });
}

function fetchData(username, id) {
  console.log("Going to fetch data");
  var bucket = 'constellational-store';
  var user = {};
  console.log("Going to fetch article ids");
  var prefix = username + '/';
  return s3.listObjectsAsync({Bucket: bucket, Prefix: prefix}).then(function(data) {
    user.articles = data.Contents.map(function (obj) {
      return obj.Key.substring(prefix.length);
    });
    user.articles.reverse();
    var i = -1;
    if (id) i = user.articles.indexOf(id);
    if (i >= 0) {
      console.log("Placing " + id + " first in the article list");
      user.articles.splice(i, 1);
      user.articles.unshift(id);
    }
    console.log("Going to fetch articles");
    var promiseArr = user.articles.map(function(id) {
      return getObj(bucket, username + '/' + id);
    });
    return Promise.all(promiseArr);
  }).then(function(articles) {
    console.log("got articles for user " + username);
    user.articles = articles;
    return user;
  });
}

function generateHTML(data) {
  console.log("generating html");
  var cssSrc = staticURL + '/style.css';
  var scriptSrc = staticURL + '/main.js';
  var reactString = React.renderToString(React.createElement(views.Articles, data));
  return "<html><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><meta name='viewport' content='width=device-width, initial-scale=1' /><link rel='stylesheet' type='text/css' href='" + cssSrc + "'><body><div id='react-mount'>" + reactString + "</div></body><script src='" + scriptSrc + "'></script></html>";
}

function storeStaticFile(key, html) {
  return s3.putObjectAsync({
    Bucket: STATIC_BUCKET_NAME,
    Key: key,
    Body: html,
    ContentType: 'text/html',
    ACL: 'public-read'
  });
}

exports.handler = function(event, context) {
  // see https://aws.amazon.com/blogs/compute/fanout-s3-event-notifications-to-multiple-endpoints
  var msgString = JSON.stringify(event.Records[0].Sns.Message);
  console.log("Stringified sns message");

  var x = msgString.replace(/\\/g,'');
  var y = x.substring(1,x.length-1);
  var snsMsgObject = JSON.parse(y);
  console.log("Got sns message object");

  var key = snsMsgObject.Records[0].s3.object.key;
  console.log("The key is: "+key);
  var key = event.Records[0].s3.object.key;
  console.log("The key is: "+key);
  var splitKey = key.split('/');
  if (splitKey.length < 2) context.fail("Not an entry");
  var username = splitKey[0];
  var id = splitKey[1];
  fetchData(username, id).then(generateHTML).then(function(html) {
    return storeStaticFile(username, html);
  }).then(context.succeed).catch(context.fail);
};
