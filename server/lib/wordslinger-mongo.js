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
	activePlayerIndex: Number,
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
		return player.playerId.toString() === playerId.toString();
	});
	if(!curPlayers) {
		console.log("Error: Can't find player in game: " + playerId);
		return;
	}
	return curPlayers[0];
};
var PlayerSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String
});

exports.GetPlayerModel = function() {
	return PlayerModel;
};

var PlayerModel = mongoose.model('Player', PlayerSchema);

var toJSON = function(obj) {
	return obj.toJSON();
};

exports.addMove = function(playerId, gameId, tiles, points, callback) {
	GameModel.findById(gameId, function(err, game) {
		if(err) {
			callback(err);
			return;
		}
		var activeGamePlayer = game.players[game.activePlayerIndex];
		if(!activeGamePlayer ||
			activeGamePlayer.playerId.toString() !== playerId)
		{
			callback(null, {route: "notYourTurn"});
			return;
		}
		var grabbedTiles = [];
		for(var i = 0; i < tiles.length; i++) {
			grabbedTiles.push(game.grabbag.pop());
		}
		game.moves.push({
			playerId: playerId,
			tiles: tiles,
			points: points,
			tilesGained: grabbedTiles
		});
		if(game.activePlayerIndex === 0 ||
			game.activePlayerIndex < game.players.length - 1)
		{
			game.activePlayerIndex++;
		} else {
			game.activePlayerIndex = 0;
		}
		var curPlayer = getPlayerDoc(game, playerId);
		var playedIds = tiles.map(
			function(a){return a._id.toString();}
		);
		var playedTiles = curPlayer.currentHand.filter(
			function(a){return playedIds.indexOf(a._id.toString()) > -1;}
		);

		for(var playedTileKey = 0; playedTileKey < playedTiles.length; playedTileKey++) {
			playedTiles[playedTileKey].remove();
		}
		grabbedTiles.forEach(function(a){curPlayer.currentHand.push(a);});

		game.save(function(err, savedGame) {
			if(err) {
				callback(err);
				return;
			}
			callback(null,
				{
					tiles: grabbedTiles,
					activePlayerId: game.players[game.activePlayerIndex].playerId
				}
			);
		});
	});
};

exports.dbgame = function() {
	GameModel.find({}, function(err, result) {
		return result;
	});
};

var getTiles = function(tileObj) {
	var arr = [];
	for(var i = 0; i < tileObj.count; i++) {
		arr.push({letter: tileObj.letter, points: tileObj.points});
	}
	return arr;
};

var createGame = function(playerId, opponentId) {
	var newGame = new GameModel();
	var grabbagTiles = _.shuffle(_.flatten(tileArray.map(getTiles)));
	var hand = [];
	for(var i = 0; i < handSize; i++) {
		hand.push(grabbagTiles.pop());
	}
	newGame.players.push({
		playerId: playerId,
		startingHand: hand,
		currentHand: hand
	});

	hand = [];

	for(i = 0; i < handSize; i++) {
		hand.push(grabbagTiles.pop());
	}

	newGame.players.push({
		playerId: opponentId,
		startingHand: hand,
		currentHand: hand
	});
	newGame.activePlayerIndex = 0;
	newGame.grabbag = grabbagTiles;

	return newGame;
};

/*
 *	Valid options:
 *	(playerId) id of player trying to retrieve or create game
 *	(gameId) if defined, tries to get game specified if player is
 *		authorized; if not defined, creates new game
 *	(opponents) currently only a string of just one opponent, required
 *		if trying to create a game
 */
exports.createOrRetrieveGame = function(options, callback) {
	if(!options.gameId && options.playerId) {
		PlayerModel.findOne({email: options.opponents}, function(err, opponent) {
			if(err) {
				callback(err, null);
				return;
			}
			if(!opponent) {
				callback(null, {
					error: "Player does not exist!"
				});
				return;
			}
			createGame(options.playerId, opponent._id).save(function(err, game) {
				callback(null, {
					gameId: game.id,
					playerHand: game.players[0].currentHand,
					isYourTurn: true
				});
				return;
			});
		});
	} else if(options.gameId && options.playerId) {
		var curPlayerId = options.playerId;
		GameModel.findById(options.gameId, function(err, game) {
			if(err) {
				callback(err);
				return;
			}
			var curPlayer = getPlayerDoc(game, curPlayerId);
			if(!curPlayer) {
				callback(null, {route: "noaccess"});
				return;
			}
			var isYourTurn = game.players[game.activePlayerIndex].playerId.toString() ===
				options.playerId.toString();
			callback(null, {
				yourId: curPlayer.playerId,
				isYourTurn: isYourTurn,
				moves: game.moves,
				playerHand: curPlayer.currentHand
			});
			return;
		});
	} else if(!options.playerId) {
		callback(null, {route: "login"});
		return;
	}
};

exports.getGames = function(playerId, callback) {
	if(playerId) {
		GameModel.find({'players.playerId': playerId},
			function(err, games) {
				callback(err, games);
				return;
			}
		);
	} else {
		callback(null, {route: "login"});
		return;
	}
};

exports.authenticate = function(email, password, callback) {
	PlayerModel.findOne({email: email, password: password},
			function(err, player) {
			if(err) {
				callback(err, null);
				return;
			}
			if(player) {
				callback(null, player);
				return;
			} else {
				callback("No account with entered credentials {" +
					email + "}", null);
				return;
			}
		}
	);
};

exports.signup = function(email, password, confirmpassword, callback) {
	if(password !== confirmpassword) {
		callback(null, {error: "Passwords do not match!"});
		return;
	}
	PlayerModel.findOne({email: email}, function(err, player) {
		if(err) {
			callback(err);
			return;
		}
		if(player) {
			console.log("Player email {" + player.email +
			"} already exists");
			callback(null, {
				error: "Account for " + email + " already exists!"
			});
		} else {
			var newPlayer = new PlayerModel({
				email: email,
				password: password});

			newPlayer.save(function(err, savedPlayer) {
				callback(null, savedPlayer);
			});
		}
	});
};

exports.logout = function(req, res) {
	req.session.playerId = null;
	req.session.email = null;
};