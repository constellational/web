import React from 'react';
import moment from 'moment';
import marked from 'marked';

class Post extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.rawMarkup = this.rawMarkup.bind(this);
  }

  rawMarkup() {
    let rawMarkup = marked(this.props.data.data, {sanitize: true});
    return { __html: rawMarkup };
  }

  render() {
    var post = this.props.data;
    return <div className="post">
      <h2><a href={'/' + this.props.username + '/' + post.id}>{post.title}</a></h2>
      <span dangerouslySetInnerHTML={this.rawMarkup()} />
      <div className="time">{moment(post.updated).format('LLLL')}</div>
    </div>;
  }

}

class User extends React.Component {
  render() {
    return <div>
      <h1><a href={'/' + this.props.username}>{this.props.username}</a></h1>
      <div className="posts">
        {this.props.posts.map(d => <Post username={this.props.username} data={d} key={d.id} />)}
      </div>
    </div>;
  }
}

export default User;
