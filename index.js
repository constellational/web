var serve = require('koa-static');
var koa = require('koa');
var app = koa();

var port = process.env.PORT || 3000;

app.use(serve('public'));
app.listen(port);
