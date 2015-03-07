var express = require('express');
var app = express();
var routers = require('./routers');

app.set( 'port', (process.env.PORT || 8080));
app.use( express.static(__dirname + '/../dist') );

routers( app );

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
