var express = require('express'),
	wordslingerRoute = require('./routes/wordslingerRoute.js'),
	wordslingerSocket = require('./lib/wordslinger-socket.js'),
	wordslingerMongo = require('./lib/wordslinger-mongo.js'),
	http = require('http'),
	MongoStore = require('connect-mongo')(express),
	io = require('socket.io'),
	ioSession = require('socket.io-session'),
	store;
var app = express();

var accessChecker = function(req, res, next) {
	if(req.session.playerId) {
		next();
	} else {
		res.redirect('/');
	}
};
var sessionSecret = 'secret key';
var sessionKey = 'wordslinger.sid';
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: sessionSecret,
		store: store = new MongoStore({
			db: "wordslinger_database"
		}),
		key: sessionKey
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

iolistener.set('authorization',
	ioSession(express.cookieParser(sessionSecret), store, sessionKey));

iolistener.sockets.on('connection', function (socket) {
	if(socket.handshake.session.playerId) {
		socket.emit('playerId', socket.handshake.session.playerId);
	}
	socket.on('login', function(data) {
		wordslingerMongo.authenticate(
			data.email,
			data.password,
			function(err, val) {
				if(!err) {
					socket.handshake.session.playerId = val._id.toString();
					socket.handshake.session.save();
					socket.playerId = val._id.toString();
					socket.emit('loginresponse', {_id: val._id});
				} else {
					console.log(err);
					socket.emit('loginresponse',
						{
							error: "Incorrect credentials for " + data.email
						}
					);
				}
			}
		);
	});
	socket.on('games', function(data) {
		if(!socket.handshake.session.playerId) {
			socket.emit("gamesresponse", {route: "login"});
		} else {
			wordslingerMongo.getGames(socket.handshake.session.playerId, function(err, val) {
				if(!err) {
					socket.emit("gamesresponse", val);
				} else {
					console.log(err);
				}
			});
		}
	});
	socket.on('newgame', function(data) {
		wordslingerMongo.createOrRetrieveGame(
			{playerId: socket.handshake.session.playerId, opponents: data.players},
			function(err, val) {
				if(!err) {
					socket.emit('newgameresponse', val);
				} else {
					console.log(err);
				}
			}
		);
	});
	socket.on('submitmove', function(data) {
		wordslingerMongo.addMove(
			socket.handshake.session.playerId,
			data.gameId,
			data.tiles,
			data.points,
			function(err, val) {
				if(!err) {
					socket.emit('submitmoveresponse', val);
					if(!val.error && !val.route) {
						iolistener.sockets
							.in('game' + data.gameId)
							.emit('incomingmove',
								{
									tiles: data.tiles,
									activePlayerId: val.activePlayerId
								}
							);
					}
				} else {
					console.log(err);
				}
			});
	});
	socket.on('getgame', function(data) {
		wordslingerMongo.createOrRetrieveGame(
			{playerId: socket.handshake.session.playerId, gameId: data.gameId},
			function(err, val) {
				if(!err) {
					if(!val.error) {
						socket.join('game' + data.gameId);
					}
					socket.emit('getgameresponse', val);
				} else {
					console.log(err);
				}
			});
	});
});
