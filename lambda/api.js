var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
if ((typeof fetch === 'undefined') && (typeof window !== 'undefined')) var fetch = window.fetch;

class API {
  constructor(apiURL, customFetch) {
    this.apiURL = apiURL;
    if (customFetch) fetch = customFetch;
  }

  fetchArticleList(username) {
    console.log("going to fetch article list for "+username);
    let url = this.apiURL + '/' + username;
    return fetch(url).then(res => res.json());
  }

  fetchArticle(username, id) {
    console.log("going to fetch article " + id + " for "+username);
    let url = this.apiURL + '/' + username + '/' + id;
    return fetch(url).then(res => res.json());
  }

  fetchData(username, id) {
    console.log("going to fetch data for " + username);
    var user = {};
    return this.fetchArticleList(username).then((user) => {
      if (id) {
        console.log("going to put " + id + " first");
        let i = user.articles.indexOf(id);
        if (i != -1) {
          user.articles.splice(i, 1);
          user.articles.unshift(id);
        }
      }
      var promiseArr = user.articles.map(id => this.fetchArticle(username, id));
      return Promise.all(promiseArr).then((articles) => {
        console.log("got articles for user " + username);
        user.articles = articles;
        return user;
      });
    });
  }
}

exports = API;
