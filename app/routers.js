module.exports = function( app ) {


	app.get('/women', function(req, res) {
		console.log("Handle women get");
	});

	app.get('/men', function(req, res) {
		console.log("Handle men get");
	});

	app.get('*', function(req, res) {
		console.log("Dir name is ", __dirname);
		res.sendFile(__dirname + '/../dist/index.html');
	});

};
