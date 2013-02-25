var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	email: String,
	password: String
});

var PlayerModel = mongoose.model('Player', PlayerSchema);

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
			res.send( JSON.stringify({
				email: player.email
			}));
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

			newPlayer.save(function(err, newPlayer) {
				req.session.email = newPlayer.email;
				req.session.playerId = newPlayer._id;
			});
			res.send( {
				email: player.email
			});
		}
	});
};