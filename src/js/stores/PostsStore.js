var PostsActions = require('../actions/PostsActions');
var _ = require('underscore');
var Reflux = require('reflux');
var $ = require('zepto-browserify').$;
var _ = require('underscore');

var localStorageKey = "postsList",
	postsCounter = 0;

var PostsStore = Reflux.createStore({

	listenables: [PostsActions],

	usersTable: {},

	// this will be called by all listening components as they register their listeners
	getInitialState: function() {
		// var loadedList = localStorage.getItem(localStorageKey);
		// if (!loadedList) {
		// 	// If no list is in localstorage, start out with a default one
			// this.postsList = [{
			// 	key: postsCounter++,
			// 	fullName: "Empty user",
			// 	body: "Empty body",
			// 	sex: 0
			// }];
		// } else {
		// 	this.postsList = _.map(JSON.parse(loadedList), function(item) {
		// 		// just resetting the key property for each todo item
		// 		item.key = postsCounter++;
		// 		return item;
		// 	});
		// }
		// return this.postsList;
		return [{key: postsCounter++, text: "text"}];
	},


	getPosts(options) {
		this._fetchList(options.url).then()
	},

	_getPosts(publicId) {
		// var loadedList =
		var loadedList = this._fetchList(publicId),
			self = this;

		loadedList.then((posts) => {
			self._normalizePostsData(posts).then(() =>

			)
			// self.isLoading = false;
			// self.trigger(posts);
		}).catch((err) => {
			console.log("Error", err);
		});

	},


	_normalizePostsData(payload) {
		var id,
			idsForLoad = [],
			usersIndex = {}
			self = this;

		_.forEach(payload, (item) => {
			id = item.signer_id;
			if(_.isNumber(id)) {
				if (typeof this.usersTable[id] === "undefined") {
					this.usersTable[id] = {
						"posts": [item]
					};
				} else {
					this.usersTable[id].posts.push(item);
				}
			}
		});

		// var authorsWithId = _.filter(payload, (item) => {
		// 	id = item.signer_id;
		// 	if (id) {
		// 		idsForLoad.push(id);
		// 		return typeof item.signer_id !== "undefined";
		// 	}
		// });

		return new Promise((resolve, reject) => {
			this._getAuthorsInfo(_.keys(this.usersTable)).then((infoList) => {
				_.forEach(infoList, (item) => {
					_.extend(self.usersTable[item.uid], item);
				})
				resolve();
			});
		});

	},


	// _mergePostsAndUserInfo(posts, info) {
	// 	_.forEach(infoList, (item) => {
	// 		_.extend(posts[item.id], item);
	// 	});
	// 	this.isLoading = false;
	// 	this.trigger(posts);
	// },

	_getAuthorsInfo(authors) {
		authors = authors.join(",");
		return new Promise((resolve, reject) => {
			$.ajax({
				type:"GET",
				dataType:"jsonp",
				url: "https://api.vk.com/method/users.get?fields=sex&uids=" + authors,
				success(data) {
					resolve(data.response);
				},
				error(err) {
					reject(err)
				}
			});
		});
	},

	_updateUserTable(payload, emit = false) {
		_.extend(this.usersTable, payload);
		if (emit) this.trigger(this.usersTable);
	},

	_filterPosts(options) {
		if (!_.isUndefined(options.sex)) {
			return _.pick(this.usersTable, (value) => {
				return value.sex === options.sex
			});
		} else {
			return this.usersTable;
		}
	},

	// called whenever we change a list. normally this would mean a database API call
	_fetchList(publicId) {
		// localStorage.setItem(localStorageKey, JSON.stringify(postsList));
		// if we used a real database, we would likely do the below in a callback
		publicId = publicId || "lovekld39";
		this.isLoading = true;
		return new Promise((resolve, reject) => {
			$.ajax({
				type:"GET",
				dataType:"jsonp",
				url: "https://api.vk.com/method/wall.get?domain=" + publicId,
				success(data) {
					resolve(data.response);
				},
				error(err) {
					reject(err)
				}
			});
		});
		// this.postsList = postsList;
		// this.trigger(postsList); // sends the updated list to all listening components (PostApp)
	},

});

module.exports = PostsStore;
