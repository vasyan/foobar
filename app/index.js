var express = require('express');
var app = express();
var routers = require('./routers');
var morgan = require('morgan');

app.use( express.static(__dirname + '/../dist') );
app.use( morgan('tiny') );
app.use( routers ) ;

app.listen(8080, function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
