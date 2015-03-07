var assert = require('chai').assert;
var vkApi = require('../app/services/vk');

describe('Vk api service', function() {
	it('should have a getDataFromPublic method', function () {
		assert.typeOf( vkApi, 'object' );
		assert.typeOf( vkApi.getDataFromPublic, 'function' );
	});
	it('should construct url to vk method', function () {
		assert.typeOf( vkApi._getMethodUrl, 'function' );
		assert.equal( vkApi._getMethodUrl('wall.get'),
			'https://api.vk.com/method/wall.get?count=100&offset=0&domain=lovelkld39');
		assert.equal( vkApi._getMethodUrl('user.get'),
			'https://api.vk.com/method/user.get?fields=bdate,sex,photo_big');
	});
});
