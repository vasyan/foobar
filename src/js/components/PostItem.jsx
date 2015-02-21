var React = require('react/addons');
var PostsActions = require('../actions/PostsActions');

module.exports = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    key: React.PropTypes.number
  },
  mixins: [React.addons.LinkedStateMixin], // exposes this.linkState used in render

  getInitialState: function() {
    return {};
  },

  handleDestroy: function() {
    PostsActions.removeItem(this.props.key);
  },
  render: function() {
    // var classes = React.addons.classSet({
    //   'completed': this.props.isComplete,
    //   'editing': this.state.isEditing
    // });
    return (
      <li>
        <div className="view">
          <p>{this.props.text}</p>
        </div>
      </li>
    );
  }
});
