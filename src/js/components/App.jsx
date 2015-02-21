/** @jsx React.DOM */

var React = require('react/addons');
var ReactRouter = require('react-router');
var Reflux = require('reflux');
var PostsActions = require('../actions/PostsActions');
var PostsStore = require('../stores/PostsStore');
var _ = require('underscore');

var PostItem = React.createClass({
	propTypes: {
		fullName: React.PropTypes.string.isRequired,
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

var PostsMain = React.createClass({
	propTypes: {
		postsList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
	},
	// mixins: [
	// 	ReactRouter.State
	// ],
	render: function() {
		var filteredList;
		switch(this.props.showing){
			case "all":
				filteredList = this.props.postsList;
				break;
			case "men":
				filteredList = _.filter(this.props.postsList, function(item){ return item.sex === 0; });
				break;
			case "women":
				filteredList = _.filter(this.props.postsList, function(item){ return item.sex === 1; });
				break;
			default:
				filteredList = this.props.postsList;
		}
		var classes = React.addons.classSet({
			// "hidden": this.props.postsList.length < 1
		});
		return (
			<section className={classes}>
				<ul className="js-posts-list">
					{ filteredList.map(function(item){
						return <PostItem text={item.text} key={item.key}/>;
					})
					}
				</ul>
			</section>
		);
	}
});

var PostsHeader = React.createClass({
	handleNewSearch(event) {
		var url = this.refs.urlInput.getDOMNode().value;
		console.log("Handle new search", url);
		PostsActions.getPosts(url);
	},
	render() {
		return (
			<header className="posts-list-header">
				<h1>Posts</h1>
				<input ref="urlInput" type="text" placeholder="Publuc url"></input>
				<button onClick={this.handleNewSearch}>Go</button>
			</header>
			);
}
});

var PostsFooter = React.createClass({
	propTypes: {
		postsList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	},
	render: function() {
		var nbrtotal = this.props.postsList.length,
		footerClass = React.addons.classSet({hidden: !nbrtotal });

		return (
			<footer className={footerClass}>
				<span className="posts-count"><strong>{nbrtotal}</strong></span>
				<ul className="posts-filters">
					<li>
					<ReactRouter.Link activeClassName="selected" to="All">All</ReactRouter.Link>
					</li>
					<li>
					<ReactRouter.Link activeClassName="selected" to="Men">Men</ReactRouter.Link>
					</li>
					<li>
					<ReactRouter.Link activeClassName="selected" to="Women">Women</ReactRouter.Link>
					</li>
				</ul>
				<button onClick={PostsActions.clearList}>{nbrtotal}</button>
			</footer>
			);
}
});

// Renders the full application
// activeRouteHandler will always be PostsMain, but with different 'showing' prop (all/completed/active)
var PostsApp = React.createClass({
	// this will cause setState({list:updatedlist}) whenever the store does trigger(updatedlist)
	mixins: [Reflux.connect(PostsStore, "postsList")],

	render: function() {
		console.log("state", this.state, this.props);
		return (
			<div>
				<PostsHeader />
				<ReactRouter.RouteHandler {...this.props} postsList={this.state.postsList}/>
				<PostsFooter postsList={this.state.postsList} />
			</div>
			);
}
});

var routes = (
	<ReactRouter.Route handler={PostsApp}>
		<ReactRouter.Route name="All" path="/" handler={PostsMain} showing="all" />
		<ReactRouter.Route name="Men" path="/men" handler={PostsMain} showing="men" />
		<ReactRouter.Route name="Women" path="/women" handler={PostsMain} showing="women" />
	</ReactRouter.Route>
);


// React.render(routes, document.getElementById('main'));

ReactRouter.run(routes, function (Handler, state) {
  React.render(<Handler params={state.params}/>, document.getElementById('main'));
});

module.exports = PostsApp;
