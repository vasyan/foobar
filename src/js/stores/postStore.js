'use strict';

var FIREBASE_URL = 'https://fiery-fire-5766.firebaseio.com/';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase(FIREBASE_URL + '/public/posts');
var publicRef = new Firebase(FIREBASE_URL + '/public');
var actions = require('../actions/actions');
var vkapi = require('../services/vkapi');
var _ = require('underscore');

var POST_PER_PAGE = 50;

var postsStore = Reflux.createStore({

	listenables: actions,

	init: function() {

		this.currentPuclicData = {
			posts: [],
			users: {}
		};

		this.settings = {
			currentPage: 1,
			url: '',
			nextPage: true,
			offset: 0,
			isLoaded: false,
			isLoading: false,
			filterOptions: {
				currentValue: 'All',
				values: {
					'All': 'All',
					'Men': 2,
					'Women': 1
				}
			},
			sortOptions: {
				currentValue: 'newest',
				values: {
					// values mapped to firebase locations
					'newest': 'time'
				}
			}
		};
	},
		// this.posts = [];
		// this.users = {};

	setSortBy: function( value ) {
		this.settings.sortOptions.currentValue = value;
	},

	setFilterBy: function( value ) {
		this.settings.filterOptions.currentValue = value;
		// var filteredPosts = this.getFilteredPosts(value);
		var filteredPosts = this.currentPuclicData.posts;

		this.trigger(this._getThisData());
	},

	// getFilteredPosts: function(value = this.filterOptions.currentValue) {
	// 	var filteredPosts;
	// 	//TODO rewrite
	// 	if (value !== "All") {
	// 		filteredPosts = this.posts.filter((post) => {
	// 			return post.sex === this.filterOptions.values[value];
	// 		});
	// 	} else {
	// 		filteredPosts = this.posts;
	// 	}

	// 	return filteredPosts;
	// },

	listenToPosts: function( pageNum ) {
		var sortOptions = this.settings.sortOptions;

		this.settings.currentPage = pageNum;
		postsRef
			.orderByChild(sortOptions.values[sortOptions.currentValue])
			// + 1 extra post to determine whether another page exists
			.limitToLast((pageNum * POST_PER_PAGE) + 1)
			.on('value', this.updatePosts.bind(this));
	},

	stopListeningToPosts: function() {
		postsRef.off();
	},

	loadMoarPosts: function() {
		this.settings.offset += POST_PER_PAGE;
		this.loadUsersFromUrl();
	},

	updatePosts: function( postsSnapshot ) {
		// posts is all posts through current page + 1
		// accumulate posts in posts array
		var endAt = this.settings.currentPage * POST_PER_PAGE,
			posts = [],
			post;

		postsSnapshot.forEach(function(postData) {
			post = postData.val();
			post.id = postData.key();
			posts.shift(post);
		});

		// if extra post doesn't exist, indicate that there are no more posts
		this.settings.nextPage = (posts.length === endAt + 1);
		// slice off extra post
		this.currentPuclicData.posts = posts.slice(0, endAt);

		this.trigger(this._getThisData());
	},

	getDefaultData: function() {
		return this._getThisData();
	},

	loadUsersFromUrl: function( url = this.settings.url ) {
		var settings = this.settings;

		settings.url = url;
		settings.isLoaded = true;
		console.log("Load users from url");
		// this.trigger( this._getThisData() );
		vkapi.fetchPostsAndUsers(settings).then((payload) => {

			this.currentPuclicData = payload;

			this.trigger({
				// posts: this.getFilteredPosts(),
				currentPuclicData: this.currentPuclicData,
				settings
			});

			return true;
		}).catch(e => {
			console.log("Error", e);
		});
	},

	// extractPosts: function(options = {}) {
	// 	var posts = [],
	// 		post;
	// 	_.forEach(this.currentPuclicData.users, (user) => {
	// 		post = _.first(this.currentPuclicData.posts);
	// 		if (post) {
	// 			posts.push(_.extend({}, post, {
	// 				sex: user.sex,
	// 				authorName: user.first_name + " " + user.last_name,
	// 				photo: user.photo_big
	// 			}));
	// 		}
	// 	});

	// 	return posts;
	// },

	_getThisData: function() {

		return {
			currentPuclicData: this.currentPuclicData,
			settings: this.settings
		};
	}

});

module.exports = postsStore;
