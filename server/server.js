var express = require('express'),
	everyauth = require('everyauth');
	wordslinger = require('./routes/wordslinger.js'),
	player = require('./routes/player.js'),
	http = require('http');
var app = express();

var accessChecker = function(req, res, next) {
	if(req.session.user && req.session.user.isAuthenticated) {
		next();
	} else {
		res.redirect('/');
	}
};

var notFound = function(req, res, next) {
	res.statusCode = 404;
	res.description = "Not found";
	res.send('not found');
};

var errorHandler = function(err, req, res, next) {
	res.send('error!');
};

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.cookieParser('This is my foogly coogly passphrace'));
	app.use(express.session({secret: 'this is the session secret'}));
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
	app.use(notFound);
	app.use(errorHandler);
});

app.configure('development', function() { //default
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
	

});

app.configure('production', function() { //$ NODE_ENV=production node server.js

});

app.get('/api/wordslinger/game', accessChecker, wordslinger.game);

app.post('/api/wordslinger/move', wordslinger.addMove);
app.get('/api/wordslinger/move', wordslinger.getMove);

app.post('/api/player/login', player.login);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});