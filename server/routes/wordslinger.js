var mongoose = require('mongoose');

var MoveSchema = new mongoose.Schema({
	tiles: [{
		letter: String,
		points: Number,
		position:
		{
			x: Number,
			y: Number
		}
	}]
});

var MoveModel = mongoose.model('Move', MoveSchema);
mongoose.connect('mongodb://localhost/wordslinger_database');

exports.getMove = function(req, res) {
	console.log('get move sessionID' + req.sessionID);
	return MoveModel.find(function(err, moves){
		if(!err) {
			return res.send(moves);
		} else {
			return console.log(err);
		}
	});
};

exports.addMove = function(req, res) {
	console.log('post move sessionID' + req.sessionID);
	var move = new MoveModel({
		tiles: req.body.tiles
	});

	move.save(function(err){
		if(!err) {
			return console.log('move saved with letter');
		}
	});
};

exports.game = function(req, res) {
	//board config?
	//board tiles
	//game id
	//player hands
	//active player index
};

exports.newGame = function(req, res) {
	//new game id
	//two players for now
};