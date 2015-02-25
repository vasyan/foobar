'use strict';

var React      = require('react/addons');
var Reflux     = require('reflux');
var actions    = require('../actions/actions');
var postsStore = require('../stores/postStore');
var Spinner    = require('../components/spinner.jsx');
var Post       = require('../components/post.jsx');
var Router     = require('react-router');
var Link       = Router.Link;

var Posts = React.createClass({

	mixins: [
		Router.Navigation,
		Reflux.listenTo(postsStore, 'onStoreUpdate')
	],

	getInitialState: function() {
		var postsData = postsStore.getDefaultData();
		return {
			loading: false,
			posts: postsData.posts,
			sortOptions: postsData.sortOptions,
			filterOptions: postsData.filterOptions,
			nextPage: postsData.nextPage,
			currentPage: postsData.currentPage
		};
	},

	// statics: {

	// 	willTransitionTo: function(transition, params) {
	// 		actions.listenToPosts(+params.pageNum || 1);
	// 	},

	// 	willTransitionFrom: function() {
	// 		actions.stopListeningToPosts();
	// 	}

	// },

	onStoreUpdate: function(postsData) {
		if (!postsData.posts.length) {
			// if no posts are returned
			this.transitionTo('home');
		}
		this.setState({
			loading: false,
			posts: postsData.posts,
			sortOptions: postsData.sortOptions,
			filterOptions: postsData.filterOptions,
			nextPage: postsData.nextPage,
			currentPage: postsData.currentPage
		});
	},

	updateSortBy: function(e) {
		e.preventDefault();
		var currentPage = this.state.currentPage || 1;

		actions.setSortBy(this.refs.sortBy.getDOMNode().value);

		this.setState({
			loading: true
		});

		if (currentPage === 1) {
			actions.stopListeningToPosts();
			actions.listenToPosts(currentPage);
		} else {
			this.transitionTo('posts', { pageNum: 1 });
		}
	},

	updateFilterBy: function(event) {
		event.preventDefault();

		var currentPage = this.state.currentPage || 1;

		actions.setFilterBy(this.refs.filterBy.getDOMNode().value);
		this.setState({
			loading: true
		});

		// if (currentPage === 1) {
		// 	actions.stopListeningToPosts();
		// 	actions.listenToPosts(currentPage);
		// } else {
		// 	this.transitionTo('posts', { pageNum: 1 });
		// }

	},

	onNewSearch: function() {
		var url = this.refs.urlInput.getDOMNode().value;
		actions.loadUsersFromUrl(url);
	},

	render: function() {
		var posts = this.state.posts;
		var currentPage = this.state.currentPage || 1;
		var sortOptions = this.state.sortOptions;
		var filterOptions = this.state.filterOptions;
		var filterValues = Object.keys(filterOptions.values);
		// possible sort values (defined in postsStore)
		var sortValues = Object.keys(sortOptions.values);

		posts = posts.map(function(post) {
			return (
				<Post post={ post } key={ post.id } />
			);
		});

		var options = sortValues.map(function(optionText, i) {
			return <option value={ sortOptions[i] } key={ i }>{ optionText }</option>;
		});

		var filterOptions = filterValues.map((text, i) => {
			return <option value={ filterOptions[i] } key={ i }>{ text }</option>;
		});

		return (
			<div className="posts-wrapper container">
				<section className="post-finder-dashboard row">
					<div className="five columns">
						<label className="label">Public url</label>
						<input ref="urlInput" className="public-url-input u-full-width" type="text" placeholder="http://vk.com/public_name"/>
					</div>
					<div className="three columns sex-filter-container">
						<select
							className="js-posts-filter-sex-select u-full-width"
							onChange={ this.updateFilterBy }
							value={ filterOptions.currentValue }
							ref="filterBy">
							{ filterOptions }
						</select>
					</div>
					<div className="three columns search-button-container">
						<button
							onClick={ this.onNewSearch }
							className="button-primary u-full-width">
							Search
						</button>
					</div>
					{/* <div className="sortby">
						<select
							id="sortby-select"
							className="sortby-select"
							onChange={ this.updateSortBy }
							value={ sortOptions.currentValue }
							ref="sortBy">
							{ options }
						</select>
					</div> */}
				</section>
				<section className="post-feed">
					<div className="post-item-container row">
						{ this.state.loading ? <Spinner /> : posts }
					</div>
					<hr />
					<nav className="pagination">
						{
							this.state.nextPage ?
								<Link to="posts" params={{ pageNum: currentPage + 1 }} className="next-page">
									Load More Posts
								</Link>
							: 'No More Posts'
						}
					</nav>
				</section>
			</div>
		);
	}

});

module.exports = Posts;
