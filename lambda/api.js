var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
if ((typeof fetch === 'undefined') && (typeof window !== 'undefined')) var fetch = window.fetch;

class API {
  function constructor(apiURL, customFetch) {
    this.apiURL = apiURL;
    if (customFetch) fetch = customFetch;
  }

  function fetchArticleList(username) {
    let url = this.apiURL + '/' + username;
    return fetch(url).then(res => res.json());
  }

  function fetchArticle(username, id) {
    let url = this.apiURL + '/' + username + '/' + id;
    return fetch(url).then(res => res.json());
  }

  function fetchData(username, id) {
    var user = {};
    return fetchArticleList(username).then((u) {
      user = u;
      if (id) {
        let i = user.articles.indexOf(id);
        if (i != -1) {
          user.articles.splice(i, 1);
          user.articles.unshift(id);
        }
      }
      var promiseArr = user.articles.map(id => fetchArticle(username, id));
      return Promise.all(promiseArr);
    }).then(function(articles) {
      user.articles = articles;
      return user;
    });
  }
}

exports = fetchData;
