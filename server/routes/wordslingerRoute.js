var mongoose = require('mongoose'),
	_ = require('underscore'),
	mongowrapper = require('../lib/wordslinger-mongo');

var GameModel = mongowrapper.GetGameModel();
var PlayerModel = mongowrapper.GetPlayerModel();

exports.move = function(req, res) {
	mongowrapper.addMove(req.session.playerId,
		req.body.gameId,
		req.body.tiles,
		req.body.points,
		function(err, val) {
			if(err) {
				return console.log(err);
			}
			res.send(val);
		});
};

exports.dbgame = function(req, res) {
	GameModel.find({}, function(err, result) {
		res.send(result);
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
	mongowrapper.createOrRetrieveGame({
		playerId: req.session.playerId,
		gameId: req.body.gameId,
		opponents: req.body.players
	}, function(err, val) {
			if(!err) {
				res.send(val);
			}
			console.log(err);
		}
	);
};

exports.games = function(req, res) {
	mongowrapper.getGames(
		req.session.playerId,
		function(err, val){
			if(!err) {
				res.send(val);
			}
			console.log(err);
		});
};

exports.login = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	mongowrapper.authenticate(email, password,
		function(err, player) {
			if(!err) {
				req.session.email = player.email;
				req.session.playerId = player._id;
				res.send({
					email: player.email
				});
			} else {
				console.log(err);
				res.send( {
					error: "Incorrect credentials for " + email
				});
			}
		}
	);
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