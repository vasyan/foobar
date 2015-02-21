var React = require('react');
var PostsActions = require('../actions/PostsActions');
var Post = require('./Post.jsx');

var PostList = React.createClass({
  getDefaultProps: function() {
    return {
      posts: []
    };
  },

  render: function() {
    return (
      <ul>
        {this.props.post.map(post =>
          <Post post={post} />
        )}
      </ul>
    );
  }
});

module.exports = PostList;
