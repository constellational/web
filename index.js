var http = require('http');

var json = {
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "5C79KQUVVH.com.constellational",
        "paths": [ "*" ]
      }
    ]
  }
};

var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(json));
}).listen(port);
