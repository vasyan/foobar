var request = require('request');
var nodeUrl = require('url');
var	_ = require('underscore');
var Q = require('q');
var Firebase = require('firebase');
var firebaseConfig = require('../database/firebaseConfig');
var publicsRef = new Firebase(firebaseConfig.publicsRef);
var colors = require('colors');

var urlOptions = {
		protocol: 'https',
		host: 'api.vk.com',
	},
	apiMethodsOptions = {
		'wall.get': {
			'count': 3,
			'offset': 0,
			'domain': ''
		},
		'users.get': {
			'fields': [
				'bdate',
				'sex',
				'photo_big'
				].join(',')
		}
	},
	postCache,
	usersCache = {},
	usersIdsCache = [],
	usersTable = {};

var _extractUsersIds = function( posts ) {

	console.log('_extractUsersIds run'.green);

	return Q.Promise(function( resolve ) {
		var id,
			cache = usersCache;
		_.forEach(posts, function( post ) {
			if ( post['post_type'] !== 'post' ) return;

			id = post['signer_id'] || 'anon';

			if ( cache[ id ] ) {
				cache[ id ]['posts'][ post.id ] = post;
			} else {
				cache[ id ] = {
					info: {},
					posts: {}
				};
				cache[ id ]['posts'][ post.id ] = post;
			}
		});

		resolve( usersCache );
	});
};

var _normalizeUsers = function ( users ) {
	_.forEach( users, function( user ) {
		usersCache[ user.uid ] = user;
	});
};

var getMethodQuery = function( method, params ) {
	var query = apiMethodsOptions[ method ];
	if ( params && params.query ) {
		_.extend( query, params.query );
	}

	var generatedOptions = _.extend( urlOptions,
		{	query: query }, { pathname: 'method/' + method }
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
				resolve( postCache );
			} else {
				reject( err );
			}
		});
	});
};

var getUsersInfo = function( users ) {

	console.log('getUsersInfo run'.green);

	var uidsQuery = {
		uids: _.keys(usersCache).join(',')
	};

	var usersUrl = getMethodQuery('users.get', { query: uidsQuery });

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
	publicName = publicName || 'lovekld39';
	apiMethodsOptions['wall.get']['domain'] = publicName;

	return Q.Promise(function( resolve ) {
		getWallPosts( publicName, params )
			.then( _.bind( _extractUsersIds, this ) )
			.then( _.bind(  getUsersInfo, this ) )
			.then(function() {
				new Firebase(firebaseConfig.publicsRef + '/' + publicName).set( usersCache );
			})
			.catch(function(err) {
				console.log('Error was catched!'.red, err);
			})
	});

};

module.exports = {
  getDataFromPublic: getDataFromPublic
};
