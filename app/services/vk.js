var request = require('request');
var nodeUrl = require('url');
var	_ = require('underscore');
var Q = require('q');
var Firebase = require('firebase');
var publicsRef = new Firebase('https://foxyhunt.firebaseio.com/publics');

var urlOptions = {
		protocol: 'https',
		host: 'api.vk.com',
	},
	apiMethodsOptions = {
		'wall.get': {
			'count': 3,
			'offset': 0,
			'domain': 'lovekld39'
		},
		'user.get': {
			'fields': [
				'bdate',
				'sex',
				'photo_big'
				].join(',')
		}
	},
	postCache,
	usersCache,
	usersTable = {};

var extractUsersIds = function( posts ) {
	console.log('Posts --------------------------------------- ', posts);
	var id,
		cache = usersCache;
	_.forEach(posts, function( post ) {
		id = post.signer_id;
		if ( id && cache.indexOf(id) === -1) {
			cache.push( id );
		}
	});

	return usersCache;
};

var getMethodQuery = function( method, params ) {
	var generatedOptions = _.extend( urlOptions,
		{	query: apiMethodsOptions[ method ], pathname: 'method/' + method },
		params
	);

	return nodeUrl.format( generatedOptions );
};

var getWallPosts = function( publicName, params ) {

	console.log('getWallPosts run');
	var wallUrl = getMethodQuery('wall.get', params);
	return Q.Promise(function( resolve, reject ) {
		request.get( wallUrl , function(err, res, body) {
			if ( !err && res.statusCode === 200) {
				postCache = JSON.parse( body ).response.slice(1);
				extractUsersIds( postCache );
				resolve( postCache );
			} else {
				reject( err );
			}
		});
	});
};

var getUsersInfo = function( users ) {

	console.log('getUsersInfo run');

	var usersUrl = getMethodQuery('users.get', { uids: usersCache });
	return Q.Promise(function( resolve, reject ) {
		request.get( usersUrl, function( err, res ) {
			if ( !err && res.statusCode === 200) {
				usersCache = res;
				resolve( res );
			}
		});
	});
};

var getDataFromPublic = function( publicName, params ) {
	getWallPosts( publicName, params ).then( getUsersInfo )
		.then(function( payload ) {console.log('PAYLOAD', payload );});

};

module.exports = {
  getDataFromPublic: getDataFromPublic,
  getWallPosts: getWallPosts
};
