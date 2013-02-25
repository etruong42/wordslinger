var express = require('express'),
	//everyauth = require('everyauth');
	wordslingerRoute = require('./routes/wordslingerRoute.js'),
	playerRoute = require('./routes/playerRoute.js'),
	http = require('http');
var app = express();

var accessChecker = function(req, res, next) {
	if(req.session.user && req.session.user.isAuthenticated) {
		next();
	} else {
		res.redirect('/');
	}
};

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser('This is my foogly coogly passphrace'));
	app.use(express.session({secret: 'this is the session secret'}));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

app.configure('development', function() { //default
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
});

app.configure('production', function() { //$ NODE_ENV=production node server.js

});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/api/wordslinger/game', wordslingerRoute.game);

app.post('/api/wordslinger/move', wordslingerRoute.addMove);
app.get('/api/wordslinger/move', wordslingerRoute.getMove);

app.post('/api/player/login', playerRoute.login);
app.post('/api/player/signup', playerRoute.signup);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});