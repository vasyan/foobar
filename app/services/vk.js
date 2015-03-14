var request = require('request');
var nodeUrl = require('url');
var	_ = require('underscore');
var Q = require('q');
var Firebase = require('firebase');
var publicsRef = new Firebase('https://foxyhunt.firebaseio.com/publics');
var colors = require('colors');

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
	usersIdsCache = [],
	usersTable = {};

var _extractUsersIds = function( posts ) {
	var id,
		cache = usersIdsCache;
	_.forEach(posts, function( post ) {
		if ( post['post_type'] !== 'post' ) return;

		id = post['signer_id'];
		if ( id && cache.indexOf(id) === -1) {
			cache.push( id );
		}
	});

	return usersIdsCache;
};

var _normalizeUsers = function ( users ) {
	_.forEach( users, function( user ) {
		usersCache[ user.uid ] = user;
	});
};

var getMethodQuery = function( method, params ) {
	var generatedOptions = _.extend( urlOptions,
		{	query: apiMethodsOptions[ method ], pathname: 'method/' + method },
		params
	);

	return nodeUrl.format( generatedOptions );
};

var getWallPosts = function( publicName, params ) {

	console.log('getWallPosts run'.green);
	var wallUrl = getMethodQuery('wall.get', params);
	return Q.Promise(function( resolve, reject ) {
		request.get( wallUrl , function(err, res, body) {
			if ( !err && res.statusCode === 200) {
				postCache = JSON.parse( body ).response.slice(1);
				_extractUsersIds( postCache );
				resolve( postCache );
			} else {
				reject( err );
			}
		});
	});
};

var getUsersInfo = function( users ) {

	var uidsQuery = {
		query: {
			uids: usersIdsCache.join(',')
		}
	};

	var usersUrl = getMethodQuery('users.get', uidsQuery);

	console.log('getUsersInfo run with url - '.green, usersUrl);

	return Q.Promise(function( resolve, reject ) {
		request.get( usersUrl, function( err, res, body) {
			if ( !err && res.statusCode === 200) {
				// console.log('Users info: '.yellow, res);
				usersCache = JSON.parse( body ).response;
				resolve( usersCache );
			}
		});
	});
};

var getDataFromPublic = function( publicName, params ) {
	return Q.Promise(function( resolve, reject ) {
		getWallPosts( publicName, params )
			.then( _.bind(  getUsersInfo, this ) )
			.then( _.bind( _extractUsersIds, this ) );
	});

};

module.exports = {
  getDataFromPublic: getDataFromPublic
};
