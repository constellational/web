var STORE_BUCKET = 'constellational-store';
var STATIC_BUCKET = 'constellational-static';
var JS_URL = 'https://d1gxzanke6jb5q.cloudfront.net/main.js';

var CSS_URL = 'https://d1gxzanke6jb5q.cloudfront.net/style.css';

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

function listPosts(username) {
  console.log("Going to list posts");
  var params = {Bucket: STORE_BUCKET, Prefix: username + '/'};
  return s3.listObjectsAsync(params).then(function(data) {
    data.Contents.reverse();
    return data.Contents;
  });
}

function fetchPosts(username, postList) {
  console.log("Going to fetch posts");
  var promiseArr = postList.map(function(post) {
    return getObj(STORE_BUCKET, post.Key);
  });
  return Promise.all(promiseArr);
}

function generateHTML(posts) {
  console.log("generating html");
  var data = {posts: posts};
  var head = "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'><meta name='viewport' content='width=device-width, initial-scale=1' /><link rel='stylesheet' type='text/css' href='" + CSS_URL + "'>";
  var reactString = React.renderToString(React.createElement(views.User, data));
  var body = "<body><div id='react-mount'>" + reactString + "</div></body><script src='" + JS_URL + "'></script></html>";
  return "<html>" + head + body + "</html>";
}

function storeStaticFile(key, html) {
  return s3.putObjectAsync({
    Bucket: STATIC_BUCKET,
    Key: key,
    Body: html,
    ContentType: 'text/html',
    ACL: 'public-read'
  });
}

exports.handler = function(event, context) {
  console.log("Starting");
  // see https://aws.amazon.com/blogs/compute/fanout-s3-event-notifications-to-multiple-endpoints
  var msgString = JSON.stringify(event.Records[0].Sns.Message);
  console.log("Stringified sns message");

  var x = msgString.replace(/\\/g,'');
  var y = x.substring(1,x.length-1);
  var snsMsgObject = JSON.parse(y);
  console.log("Got sns message object");

  var fullKey = snsMsgObject.Records[0].s3.object.key;
  console.log("The key is: " + fullKey);
  var splitKey = fullKey.split('/');
  var username = splitKey.shift();
  var key = splitKey.shift();

  listPosts(username).then(function(postList) {
    if (key) {
      var postKeys = postList.map(function(post) {
        return post.Key;
      });
      var index = postKeys.indexOf(key);
      var versionedKey = postList[index];
      if (index > 0) {
        console.log("Placing " + id + " first in the list");
        postList.splice(index, 1);
        postList.unshift(versionedKey);
      }
    }
    return fetchPosts(username, postList);
  }).then(generateHTML).then(function(html) {
    return storeStaticFile(username, html).then(function() {
      if (key) {
        // key looks like 2015-11-09T16%3A38%3A41.225Z2gLGKL1y
        // 28 char timestamp + id
        var id = key.substring(28);
        return storeStaticFile(username + '/' + id, html);
      }
    });
  }).then(context.succeed).catch(context.fail);
};
