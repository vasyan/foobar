'use strict';

var React      = require('react/addons');
var Reflux     = require('reflux');
var actions    = require('../actions/actions');
var postsStore = require('../stores/postStore');
var Spinner    = require('../components/spinner.jsx');
var Waypoint   = require('react-waypoint');
var Post       = require('../components/post.jsx');
var Router     = require('react-router');
var Link       = Router.Link;
var _          = require('underscore');

var Posts = React.createClass({

	mixins: [
		Router.Navigation,
		Reflux.listenTo(postsStore, 'onStoreUpdate')
	],

	getInitialState: function() {
		var postsData = postsStore.getDefaultData();
		return {
			isLoading: false,
			isloaded: false,
			posts: postsData.currentPuclicData.posts,
			users: postsData.currentPuclicData.users,
			sortOptions: postsData.settings.sortOptions,
			filterOptions: postsData.settings.filterOptions,
			nextPage: postsData.settings.nextPage,
			currentPage: postsData.settings.currentPage
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
		// if (!postsData.posts.length) {
		// 	// if no posts are returned
		// 	this.transitionTo('home');
		// }
		this.setState({
			isLoading: false,
			isLoaded: postsData.settings.isLoaded,
			posts: postsData.currentPuclicData.posts,
			users: postsData.currentPuclicData.users,
			sortOptions: postsData.settings.sortOptions,
			filterOptions: postsData.settings.filterOptions,
			nextPage: postsData.settings.nextPage,
			currentPage: postsData.settings.currentPage
		});
	},

	updateSortBy: function(e) {
		e.preventDefault();
		var currentPage = this.state.currentPage || 1;

		actions.setSortBy(this.refs.sortBy.getDOMNode().value);

		this.setState({
			isLoading: true
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
			isLoading: true
		});

		// if (currentPage === 1) {
		// 	actions.stopListeningToPosts();
		// 	actions.listenToPosts(currentPage);
		// } else {
		// 	this.transitionTo('posts', { pageNum: 1 });
		// }

	},

	loadMoarPosts: function() {
		if (this.state.isLoaded) {
			this.setState({ isLoading: true });
			actions.loadMoarPosts();
		}
	},

	onNewSearch: function() {
		var url = this.refs.urlInput.getDOMNode().value;
		if (url) url = url.match(/\/([\w\d]+)$/)[1];
		actions.loadUsersFromUrl( url || "lovekld39" );
	},

	render: function() {
		var posts = this.state.posts,
			currentPage = this.state.currentPage || 1,
			sortOptions = this.state.sortOptions,
			filterOptions = this.state.filterOptions,
			filterValues = Object.keys(filterOptions.values),
			sortValues = Object.keys(sortOptions.values),
			users = this.state.users;

		posts = posts.map(function(post) {
			if ( !_.isObject(post) ) return;
			return (
				<Post
					post={ post }
					filterBy={ filterOptions.values[filterOptions.currentValue] }
					user={ users[ post.signer_id ] }
					key={ post.id } />
			);
		});

		var options = sortValues.map(function(optionText, i) {
			return <option value={ sortOptions[ i ] } key={ i }>{ optionText }</option>;
		});

		var filterOptions = filterValues.map((text, i) => {
			return <option value={ filterOptions[ i ] } key={ i }>{ text }</option>;
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
					{ posts }
					{ this.state.isLoading ? <Spinner/> : "" }
					<hr />
					<Waypoint onEnter={ this.loadMoarPosts }/>
				</section>

			</div>
		);
	}

});

module.exports = Posts;
