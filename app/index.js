var express = require('express');
var app = express();
var routers = require('./routers');

app.use( express.static(__dirname + '/../dist') );

app.use( routers ) ;

app.listen(8080, function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
