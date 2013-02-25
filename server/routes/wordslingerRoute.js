var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wordslinger_database');

var GameSchema = new mongoose.Schema({
	moves: [
		{
			playerIndex: Number,
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
					ponts: Number
				}
			]
		}
	],
	grabbag: [
		{
			letter: String,
			ponts: Number
		}
	]
});

var GameModel = mongoose.model('Game', GameSchema);

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
	if(!req.body.gameId) {
		var newGame = new GameModel();
		newGame.save(function(err, game) {
			res.send({gameId: game.id});
		});
	}
};