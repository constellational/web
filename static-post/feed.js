var RSS = require('rss');
var URL = 'https://constellational.com';

function generateFeed(data) {
  var feed = new RSS({
    title: 'title',
    description: 'description',
    author: data.username,
    feed_url: URL + '/' + data.username + '/rss',
    site_url: URL + '/' + data.username,
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: '60'
  });

  data.articles.forEach(function(article) {
    feed.item({
      title: article.title,
      description: article.description,
      url: URL + '/' + data.username + '/' + article.id,
      date: article.updated
    });
  });
}

module.exports = generateFeed;
  
