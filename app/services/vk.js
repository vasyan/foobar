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
			'count': 8,
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

var _updateUsersCache = function( data ) {

	console.log('_extractUsersIds run'.green);

	return Q.Promise(function( resolve ) {
		var id,
			_usersCache = _.extend( {}, usersCache );

		_.forEach(data, function( item ) {
			if ( item['post_type'] !== 'post' || !_.isNumber(item['signer_id']) ) return;

			id = item['signer_id'] || 'anon';

			if ( _usersCache[ id ] ) {
				_usersCache[ id ]['posts'][ item.id ] = item;
			} else {
				_usersCache[ id ] = {
					info: {},
					posts: {}
				};
				_usersCache[ id ]['posts'][ item.id ] = item;
			}
		});
		usersCache = _usersCache;

		resolve( _usersCache );
	});
};

var mergePostsToUsers = function( payload ) {

	// console.log('MergePostsToUsers run with'.yellow);

	return Q.Promise(function( resolve ) {
		_.forEach(payload.info, function( item ) {
			if (usersCache[ item.uid ]) {
				usersCache[ item.uid ][ 'info' ] = item;
			} else {
				usersCache[ item.uid ] = {
					info: item,
					posts: {}
				};
			}
		});

		resolve( usersCache );
	});
};

var getMethodQuery = function( method, params ) {
	var query = apiMethodsOptions[ method ];
	if ( params && params.query ) {
		_.extend( query, params.query );
	}

	var generatedOptions = _.extend( urlOptions,
		{	query: query }, { pathname: 'method/' + method }, params
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

	return Q.Promise(function( resolve, reject ) {


		var uidsQuery = {
			uids: _.keys( users ).join(',')
		};

		console.log('getUsersInfo run'.green, _.size( users ) );

		var usersUrl = getMethodQuery('users.get', { query: uidsQuery });

		request.get( usersUrl, function( err, res, body) {
			if ( !err && res.statusCode === 200) {
				// console.log('Users info: '.yellow, res);
				var _usersInfoCache = JSON.parse( body ).response;
				resolve( { info: _usersInfoCache, users: users } );
			}
		});
	});
};

var getDataFromPublic = function( publicName, params ) {
	publicName = publicName || 'lovekld39';
	apiMethodsOptions['wall.get']['domain'] = publicName;

	return Q.Promise(function( resolve ) {
		getWallPosts( publicName, params )
			.then( _.bind( _updateUsersCache, this ) )
			.then( _.bind( getUsersInfo, this ) )
			.then( _.bind( mergePostsToUsers ), this )
			.then(function( _usersCache ) {
				_.extend( usersCache, _usersCache );
				// console.log('Firebase arguments'.blue, _usersCache );
				new Firebase( firebaseConfig.publicsRef + '/' + publicName ).update( _usersCache );
			})
			.catch(function(err) {
				console.log('Error was catched!'.red, err);
				console.log(err.stack);
			});
	});

};

module.exports = {
  getDataFromPublic: getDataFromPublic
};
