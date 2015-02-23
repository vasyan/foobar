var usersTable = {};
var $ = require('jquery');
var _ = require('underscore');

function getPosts(options) {
	_fetchList(options.url).then();
}

// function _getPosts(publicId) {
// 	// var loadedList =
// 	var loadedList = _fetchList(publicId);

// 	loadedList.then((posts) => {
// 		_normalizePostsData(posts).then(() => {

// 			}
// 		);
// 		// self.isLoading = false;
// 		// self.trigger(posts);
// 	}).catch((err) => {
// 		console.log("Error", err);
// 	});

// }

function _normalizePostsData(payload) {
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
		_getAuthorsInfo(_.keys(usersTable)).then((infoList) => {
			_.forEach(infoList, (item) => {
				_.extend(usersTable[item.uid], item);
			});
			resolve();
		});
	});

}

function _getAuthorsInfo(authors) {
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
				reject(err);
			}
		});
	});
}

// function _updateUserTable(payload, emit = false) {
// 	_.extend(usersTable, payload);
// 	if (emit) trigger(usersTable);
// };

// function _filterPosts(options) {
// 	if (!_.isUndefined(options.sex)) {
// 		return _.pick(usersTable, (value) => {
// 			return value.sex === options.sex;
// 		});
// 	} else {
// 		return usersTable;
// 	}
// }

	// called whenever we change a list. normally this would mean a database API call
function _fetchList(publicId) {
	// localStorage.setItem(localStorageKey, JSON.stringify(postsList));
	// if we used a real database, we would likely do the below in a callback
	publicId = publicId || "lovekld39";
	return new Promise((resolve, reject) => {
		$.ajax({
			type:"GET",
			dataType:"jsonp",
			url: "https://api.vk.com/method/wall.get?domain=" + publicId,
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
}

function _fetchActiveUsers(url) {
	return new Promise((resolve, reject) => {
		_fetchList(url).then(payload => {
			return _normalizePostsData(payload);
		}).then(() => {
			resolve(usersTable);
		});
	});
}

module.exports = {
  fetchActiveUsers: _fetchActiveUsers
};
