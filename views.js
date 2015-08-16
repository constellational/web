var React = require('react');
var moment = require('moment');

var Article = React.createClass({
  render: function() {
    var article = this.props.article;
    return <div className="article">
      <h2><a href="/"+{this.props.username}+"/"+{article.id}>{article.heading}</a></h2>
      <div>{article.data}</div>;
      <div className="time">{moment(article.updated).fromNow()}</div>
    </div>
  }
});

var Articles = React.createClass({
  render: function() {
    return <h1><a href="/"+{this.props.username}>{this.props.username}</a></h1>
    <div className="articles">
      {this.props.articles.map(d => <Article username={this.props.username} data={d} key={d.id} />)}
    </div>;
  }
});

exports.Articles = Articles;
