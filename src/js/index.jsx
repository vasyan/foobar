var React = require('react/addons');
var Reflux  = require('reflux');

var Router        = require('react-router');
var RouteHandler  = Router.RouteHandler;
var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Link          = Router.Link;

var actions    = require('./actions/actions');
var Posts      = require('./views/posts.jsx');
// var SinglePost = require('./views/single');

var HuntPosts = React.createClass({

	getInitialState: function() {
		return {};
	},


	render: function() {
		var cx = React.addons.classSet;

		return (
			<RouteHandler { ...this.props }/>
		)
	}
});

var routes = (
	<Route handler={ HuntPosts }>
		<Route name="posts" path="/posts/:pageNum" handler={ Posts } ignoreScrollBehavior />
		<DefaultRoute name="home" handler={ Posts } />
	</Route>
);

Router.run(routes, function(Handler, state) {
  React.render(<Handler params={ state.params } />, document.querySelector('.js-main-container'));
});
