var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wordslinger_database');

var GameSchema = new mongoose.Schema({
	moves: [
		{
			playerId: mongoose.Schema.Types.ObjectId,
			points: Number,
			tiles: [
				{
					letter: String,
					points: Number,
					//tiles with no positions are swapped
					//that is, weren't put on the board
					position:
					{
						x: Number,
						y: Number
					}
				}
			],
			tilesGained : [
				{
					letter: String,
					points: Number
				}
			]
		}
	],
	players: [
		{
			playerId: mongoose.Schema.Types.ObjectId,
			startingHand: [
				{
					letter: String,
					points: Number
				}
			],
			currentHand: [
				{
					letter:String,
					points: Number
				}
			]
		}
	],
	grabbag: [
		{
			letter: String,
			points: Number
		}
	]
});

exports.GetGameModel = function() {
	return GameModel;
};

var GameModel = mongoose.model('Game', GameSchema);

var PlayerSchema = new mongoose.Schema({
	email: String,
	password: String
});

exports.GetPlayerModel = function() {
	return PlayerModel;
};

var PlayerModel = mongoose.model('Player', PlayerSchema);

exports.getMove = function(req, res) {
	console.log('get move sessionID ' + req.sessionID);
	return MoveModel.find(function(err, moves){
		if(!err) {
			return res.send(moves);
		} else {
			return console.log(err);
		}
	});
};

exports.addMove = function(req, res) {
	console.log('post move sessionID ' + req.sessionID);
	console.log('trying to update game with id {' + req.body.gameId +'}');
	//TODO: find game by id AND logged in player has write access
	GameModel.findById(req.body.gameId, function(err, game) {
		if(err) return console.log(err);
		game.moves.push({tiles: req.body.tiles});
		game.save(function(err) {
			if(err) {
				return console.log(err);
			}
		});
	});
};

exports.game = function(req, res) {
	if(!req.body.gameId && req.session.playerId) {
		//no gameId from a logged in player means create
		var newGame = new GameModel();
		var player = {};
		newGame.players.push({playerId: req.session.playerId});
		newGame.save(function(err, game) {
			res.send({gameId: game.id});
		});
	} else if(req.body.gameId && req.session.playerId) {
		//request with a gameId from a logged in player means retrieve
		//TODO: add permissions
		GameModel.findById(req.body.gameId, function(err, game) {
			if(err) return console.log(err);
			res.send(game.moves); //array of moves
		});
	} else if(!req.session.playerId) {
		res.send({route: "login"});
	}
};

exports.games = function(req, res) {
	if(req.session.playerId) {
		GameModel.find({'players.playerId': req.session.playerId},
			function(err, games) {
				console.log(games);
				res.send(games);
			}
		);
	} else {
		res.send({route: "login"});
	}
};

exports.login = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	PlayerModel.findOne({email: email, password: password}, function(err, player) {
		if(err) {
			return console.log(err);
		}
		if(player) {
			req.session.email = player.email;
			req.session.playerId = player._id;
			res.send( {
				email: player.email
			});
		} else {
			console.log("Incorrect credentials for {" + email +
			"}");
			res.send( {
				error: "Incorrect credentials for " + email
			});
		}
	});
};

exports.signup = function(req, res) {
	if(req.body.password !== req.body.confirmpassword) {
		return;
	}
	var email = req.body.email;
	var password = req.body.password;
	PlayerModel.findOne({ email: email}, function(err, player) {
		if(err) {
			return console.log(err);
		}
		if(player) {
			console.log("Player email {" + player.email +
			"} already exists");
			res.send({
				error: "Account for " + email + " already exists!"
			});
		} else {
			var newPlayer = new PlayerModel({
				email: email,
				password: password});

			newPlayer.save(function(err, savedPlayer) {
				req.session.email = savedPlayer.email;
				req.session.playerId = savedPlayer._id;
				res.send( {
					email: savedPlayer.email
				});
			});
		}
	});
};

exports.logout = function(req, res) {
	req.session.playerId = null;
	req.session.email = null;
};