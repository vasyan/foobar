var request = require('request')
	, _ = require('underscore');

var VK_API_URL = 'https://api.vk.com/method/',
	options = {},
	apiMethodsOptions = {
		'wall.get': {
			'count': 100,
			'offset': 0,
			'domain': 'lovekld39'
		},
		'user.get': {
			'fields': [
				'bdate',
				'sex',
				'photo_big'
				]
		}
	};

var getMethodUrl = function( method ) {
	var apiMethodOptions = apiMethodsOptions[ method ];
	var dataProps = _.keys(apiMethodOptions);
	var url = _.map(dataProps, function( prop ) {
		var values = apiMethodOptions[ prop ];
		return prop + '=' + values.join('&');
	}).join('');

	return VK_API_URL + method + url;
};

module.exports = {
  getDataFromPublic: function( url ) {

  	// request( VK_API_URL + 'wall.get?count=100&offset=' + options.offset + '&domain=' + options.url)
  },

  _getMethodUrl: getMethodUrl,

};
