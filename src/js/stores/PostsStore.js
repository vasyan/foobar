var PostsActions = require('../actions/PostsActions');
var _ = require('underscore');
var Reflux = require('reflux');
var $ = require('zepto-browserify').$;

var localStorageKey = "postsList",
	postsCounter = 0;

var PostsStore = Reflux.createStore({

	listenables: [PostsActions],

	// called whenever we change a list. normally this would mean a database API call
	fetchList(publicId) {
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


	getPosts(publicId) {
		console.log("Get new posts from", publicId);
		// var loadedList =
		var loadedList = this.fetchList(publicId),
			self = this;

		loadedList.then((payload) => {
			console.log("Resolve!", payload);
			self.postsList = payload;
			self.isLoading = false;
			self.trigger(payload);
		}).catch((err) => {
			console.log("AJAX error", err);
		});

	},

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
	}

});

module.exports = PostsStore;
