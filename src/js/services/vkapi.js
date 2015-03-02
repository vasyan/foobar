var usersTable = {};
var _ = require('underscore');
var $ = require('jquery');

var usersFields = [
	"bdate",
	"sex",
	"photo_big"
].join(",");

var usersIdCache = [],
	usersCache = {},
	postsCache = [];

var _extractUsersIds = function( posts ) {
	var id,
		cache = usersIdCache;
	_.forEach(posts, ( post ) => {
		id = post.signer_id;
		if ( id && cache.indexOf(id) === -1) {
			cache.push( id );
		}
	});

	return usersIdCache;
};

var _normalizePostsData = function( payload ) {
	var id;

	_.forEach(payload, (item) => {
		id = item.signer_id;
		if(_.isNumber(id)) {
			if (typeof usersTable[id] === "undefined") {
				usersTable[id] = {
					"posts": [item]
				};
			} else {
				usersTable[id].posts.push(item);
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
		_getAuthorsInfo().then((infoList) => {
			_.forEach(infoList, (item) => {
				_.extend(usersTable[item.uid], item);
			});
			resolve();
		});
	});

};

var _getAuthorsInfo = function( authors ) {

	if (authors.length) {
		authors = authors.join(",");
		return new Promise(( resolve, reject ) => {
			$.ajax({
				type:"GET",
				dataType:"jsonp",
				url: "https://api.vk.com/method/users.get?fields=" + usersFields + "&uids=" + authors,
				success(data) {
					resolve(data.response);
				},
				error(err) {
					reject(err);
				}
			});
		});
	} else {
		return new Promise(( resolve, reject ) => {
			resolve();
		});
	}

};

	// called whenever we change a list. normally this would mean a database API call
var _fetchList = function( options ) {
	// localStorage.setItem(localStorageKey, JSON.stringify(postsList));
	// if we used a real database, we would likely do the below in a callback
	var options = options;
	return new Promise((resolve, reject) => {
		var url = "https://api.vk.com/method/wall.get?count=100&offset=" +
			options.offset + "&domain=" + options.url;

		$.ajax({
			type:"GET",
			dataType:"jsonp",
			url: url,
			success(data) {
				resolve(data.response);
			},
			error(err) {
				reject(err);
			}
		});
	});
	// postsList = postsList;
	// this.trigger(postsList); // sends the updated list to all listening components (PostApp)
};

var _normalizeUsers = function ( users ) {
	_.forEach( users, ( user ) => {
		usersCache[ user['uid'] ] = user;
	});
};

var fetchPostsAndUsers = function( options ) {
	return new Promise((resolve, reject) => {
		_fetchList(options).then(payload => {
			// return _normalizePostsData(payload);
			postsCache = payload;
			var authorsIds = _extractUsersIds( payload );

			return _getAuthorsInfo(authorsIds);
		}).then((users) => {
			_normalizeUsers( users );
			resolve({
				users: usersCache,
				posts: postsCache
			});
		});
	});
};

module.exports = {
  fetchPostsAndUsers
};
