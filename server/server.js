var express = require('express'),
	wordslingerRoute = require('./routes/wordslingerRoute.js'),
	wordslingerSocket = require('./lib/wordslinger-socket.js'),
	wordslingerMongo = require('./lib/wordslinger-mongo.js'),
	http = require('http'),
	MongoStore = require('connect-mongo')(express),
	io = require('socket.io');
var app = express();

var accessChecker = function(req, res, next) {
	if(req.session.playerId) {
		next();
	} else {
		res.redirect('/');
	}
};

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'this is the session secret',
		store: new MongoStore({
			db: "wordslinger_database"
		})
	}));
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

app.post('/api/wordslinger/move', wordslingerRoute.move);

app.get('/api/wordslinger/games', wordslingerRoute.games);

app.get('/admin/games', wordslingerRoute.dbgame);

app.post('/api/player/login', wordslingerRoute.login);
app.post('/api/player/signup', wordslingerRoute.signup);

var server = http.createServer(app)
	.listen(app.get('port'), function(){
		console.log("Express server listening on port " +
			app.get('port'));
	});

var iolistener = io.listen(server);

module.exports.iolistener = iolistener;

iolistener.sockets.on('connection', function (socket) {
	var emitFunction = function(err, val) {
		if(!err) {
			socket.emit(val);
		}
	};
	socket.on('login', function(data) {
		wordslingerMongo.authenticate(
			data.email,
			data.password,
			function(err, val) {
				if(!err) {
					socket.emit('loginresponse', val);
				} else {
					console.log(err);
				}
			}
		);
	});
});
