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
    return this.fetchArticleList(username).then((user) => {
      if (id) {
        let i = user.articles.indexOf(id);
        if (i != -1) {
          user.articles.splice(i, 1);
          user.articles.unshift(id);
        }
      }
      var promiseArr = user.articles.map(id => this.fetchArticle(username, id));
      return Promise.all(promiseArr).then((articles) => {
        user.articles = articles;
        return user;
      });
    });
  }
}

exports = API;
