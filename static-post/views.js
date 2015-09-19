var React = require('react');
var moment = require('moment');

var Post = React.createClass({
  render: function() {
    var post = this.props.data;
    return <div className="post">
      <h2><a href={'/' + this.props.username + '/' + post.id}>{post.title}</a></h2>
      <div>{post.data}</div>;
      <div className="time">{moment(post.updated).fromNow()}</div>
    </div>
  }
});

var User = React.createClass({
  render: function() {
    return <div>
      <h1><a href={'/' + this.props.username}>{this.props.username}</a></h1>
      <div className="posts">
        {this.props.posts.map(d => <Post username={this.props.username} data={d} key={d.id} />)}
      </div>
    </div>;
  }
});

exports.User = User;
