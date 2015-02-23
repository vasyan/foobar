'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase('https://fiery-fire-5766.firebaseio.com/posts');
var actions = require('../actions/actions');
var vkapi = require('../services/vkapi');

var postsPerPage = 8;

var postsStore = Reflux.createStore({

	listenables: actions,

	init: function() {
		this.posts = [];
		this.users = {};
		this.currentPage = 1;
		this.nextPage = true;
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

		this.trigger({
			posts: this.posts,
			currentPage: this.currentPage,
			nextPage: this.nextPage,
			sortOptions: this.sortOptions
		});
	},

	getDefaultData: function() {
		return {
			posts: this.posts,
			currentPage: this.currentPage,
			nextPage: this.nextPage,
			sortOptions: this.sortOptions
		};
	},

	loadUsersFromUrl: function(url) {
		vkapi.fetchActiveUsers(url).then()
	}

});

module.exports = postsStore;
