'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase('https://fiery-fire-5766.firebaseio.com/posts');
var actions = require('../actions/actions');
var vkapi = require('../services/vkapi');
var _ = require('underscore');

var postsPerPage = 50;

var postsStore = Reflux.createStore({

	listenables: actions,

	init: function() {
		this.posts = [];
		this.users = {};
		this.currentPage = 1;
		this.url = "";
		this.nextPage = true;
		this.offset = 0;
		this.filterOptions = {
			currentValue: 'All',
			values: {
				'All': 'All',
				'Men': 2,
				'Women': 1
			}
		};
		this.sortOptions = {
			currentValue: 'newest',
			values: {
				// values mapped to firebase locations
				'newest': 'time'
			}
		};
	},

	setSortBy: function(value) {
		this.sortOptions.currentValue = value;
	},

	setFilterBy: function(value) {
		this.filterOptions.currentValue = value;
		var filteredPosts = this.getFilteredPosts(value);

		this.trigger(_.extend(this._getThisData(), { posts: filteredPosts }));
	},

	getFilteredPosts: function(value = this.filterOptions.currentValue) {
		var filteredPosts;
		//TODO rewrite
		if (value !== "All") {
			filteredPosts = this.posts.filter((post) => {
				return post.sex === this.filterOptions.values[value];
			});
		} else {
			filteredPosts = this.posts;
		}

		return filteredPosts;
	},

	listenToPosts: function(pageNum) {
		this.currentPage = pageNum;
		postsRef
			.orderByChild(this.sortOptions.values[this.sortOptions.currentValue])
			// + 1 extra post to determine whether another page exists
			.limitToLast((this.currentPage * postsPerPage) + 1)
			.on('value', this.updatePosts.bind(this));
	},

	stopListeningToPosts: function() {
		postsRef.off();
	},

	loadMoarPosts: function() {
		this.offset += 100;
		this.loadUsersFromUrl();
	},

	updatePosts: function(postsSnapshot) {
		// posts is all posts through current page + 1
		var endAt = this.currentPage * postsPerPage;
		// accumulate posts in posts array
		var posts = [];
		postsSnapshot.forEach(function(postData) {
			var post = postData.val();
			post.id = postData.key();
			posts.unshift(post);
		});

		// if extra post doesn't exist, indicate that there are no more posts
		this.nextPage = (posts.length === endAt + 1);
		// slice off extra post
		this.posts = posts.slice(0, endAt);

		this.trigger(this._getThisData());
	},

	getDefaultData: function() {
		return this._getThisData();
	},

	loadUsersFromUrl: function(url=this.url) {
		this.url = url;
		console.log("Load users from url");
		vkapi.fetchActiveUsers({ url: url, offset: this.offset }).then((usersTable) => {
			this.users = usersTable;
			this.posts = this.extractPosts();
			this.trigger({
				posts: this.getFilteredPosts(),
				currentPage: this.currentPage,
				nextPage: this.nextPage,
				sortOptions: this.sortOptions,
				filterOptions: this.filterOptions
			});

			return true;
		}).catch(e => {
			console.log("Error", e);
		});
	},

	extractPosts: function(options = {}) {
		var posts = [],
			post;
		_.forEach(this.users, (user) => {
			post = _.first(user.posts);
			if (post) {
				posts.push(_.extend({}, post, {
					sex: user.sex,
					authorName: user.first_name + " " + user.last_name,
					photo: user.photo_big
				}));
			}
		});

		return posts;
	},

	_getThisData: function() {
		return {
			posts: this.posts,
			currentPage: this.currentPage,
			nextPage: this.nextPage,
			sortOptions: this.sortOptions,
			filterOptions: this.filterOptions
		};
	}

});

module.exports = postsStore;
