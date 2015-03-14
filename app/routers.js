var express = require('express');
var router = express.Router();
var vkApi = require('./services/vk');

router.get('/women', function(req, res) {
	res.json('Women');
	console.log("message", vkApi);
	vkApi.getDataFromPublic();
	// 	console.log('Ten!');
	// });
});

router.get('/men', function(req, res) {
	res.json('Men');
});

router.get('/', function(req, res) {
	res.sendFile(__dirname + '/../dist/index.html');
});

module.exports = router;
