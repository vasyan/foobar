var assert = require('chai').assert;
var vkApi = require('../app/services/vk');
var request = require('superagent');
var sinon = require('sinon');



suite('Vk api service', function() {

	setup(function() {
		this.request = sinon.useFakeXMLHttpRequest();
	});

	test('should spy itself', function () {

		request.get = function(url, fn) {
			console.log("message");
			expect(url).to.be('https://api.vk.com/wall.get');
			// fn();
		};

		vkApi.getDataFromPublic();

	});
});
