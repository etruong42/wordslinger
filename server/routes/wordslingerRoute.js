var mongoose = require('mongoose');
var _ = require('underscore');

var tileArray = [
	{letter:"A", points:1, count:9},
	{letter:"B", points:3, count:2},
	{letter:"C", points:3, count:2},
	{letter:"D", points:1, count:5},
	{letter:"E", points:1, count:12},
	{letter:"F", points:4, count:2},
	{letter:"G", points:1, count:5},
	{letter:"H", points:4, count:2},
	{letter:"I", points:1, count:9},
	{letter:"J", points:8, count:1},
	{letter:"K", points:5, count:1},
	{letter:"L", points:1, count:4},
	{letter:"M", points:3, count:2},
	{letter:"N", points:1, count:6},
	{letter:"O", points:1, count:8},
	{letter:"P", points:3, count:2},
	{letter:"Q", points:10, count:1},
	{letter:"R", points:1, count:6},
	{letter:"S", points:1, count:4},
	{letter:"T", points:1, count:6},
	{letter:"U", points:1, count:4},
	{letter:"V", points:4, count:2},
	{letter:"W", points:4, count:2},
	{letter:"X", points:8, count:1},
	{letter:"Y", points:4, count:2},
	{letter:"Z", points:10, count:1},
	{letter:"", points:0, count:2}
];

var handSize = 7;

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
var getPlayerDoc = function(game, playerId) {
	var curPlayers = game.players.filter(function(player) {
		return player.playerId.toString() === playerId;
	});
	if(!curPlayers) {
		console.log("Error: Can't find player in game: " + playerId);
		return;
	}
	return curPlayers[0];
};
var PlayerSchema = new mongoose.Schema({
	email: String,
	password: String
});

exports.GetPlayerModel = function() {
	return PlayerModel;
};

var PlayerModel = mongoose.model('Player', PlayerSchema);

var toJSON = function(obj) {
	return obj.toJSON();
};

exports.move = function(req, res) {
	console.log('post move sessionID ' + req.sessionID);
	console.log('trying to update game with id {' + req.body.gameId +'}');
	//TODO: find game by id AND logged in player has write access
	GameModel.findById(req.body.gameId, function(err, game) {
		if(err) {
			return console.log(err);
		}
		//var grabbedTiles = game.grabbag.splice(0, req.body.tiles.length);
		var grabbedTiles = [];
		for(var i = 0; i < req.body.tiles.length; i++) {
			grabbedTiles.push(game.grabbag.pop());
		}
		game.moves.push({
			playerId: req.session.playerId,
			tiles: req.body.tiles,
			//TODO points: points
			tilesGained: grabbedTiles
		});
		var curPlayer = getPlayerDoc(game, req.session.playerId);
		for(var tileIndex = 0; tileIndex < req.body.tiles.length; tileIndex++) {
			curPlayer.currentHand
				.remove(mongoose.Types.ObjectId(req.body.tiles[tileIndex]._id));
		}
		
		game.save(function(err, savedGame) {
			if(err) {
				return console.log(err);
			}
			res.send({tiles: grabbedTiles});
		});
	});
};

var getTiles = function(tileObj) {
	var arr = [];
	for(var i = 0; i < tileObj.count; i++) {
		arr.push({letter: tileObj.letter, points: tileObj.points});
	}
	return arr;
};

exports.game = function(req, res) {
	if(!req.body.gameId && req.session.playerId) {
		//no gameId from a logged in player means create
		var newGame = new GameModel();
		var grabbagTiles = _.shuffle(_.flatten(tileArray.map(getTiles)));
		var hand = [];
		for(var i = 0; i < handSize; i++) {
			hand.push(grabbagTiles.pop());
		}
		newGame.players.push({
			playerId: req.session.playerId,
			startingHand: hand,
			currentHand: hand
		});
		newGame.grabbag = grabbagTiles;
		newGame.save(function(err, game) {
			res.send({
				gameId: game.id,
				playerHand: game.players[0]
			});
		});
	} else if(req.body.gameId && req.session.playerId) {
		//request with a gameId from a logged in player means retrieve
		//TODO: add permissions
		var curPlayerId = req.session.playerId;
		GameModel.findById(req.body.gameId, function(err, game) {
			if(err) return console.log(err);
			var curPlayer = getPlayerDoc(game, curPlayerId);
			res.send({
				moves: game.moves,
				playerHand: curPlayer.currentHand
			});
		});
	} else if(!req.session.playerId) {
		res.send({route: "login"});
	}
};

exports.games = function(req, res) {
	if(req.session.playerId) {
		GameModel.find({'players.playerId': req.session.playerId},
			function(err, games) {
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