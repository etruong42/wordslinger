var iolistener = require("../server").iolistener,
	socket = require("socket.io"),
	wordslingerMongo = require('./wordslinger-mongo.js');

var playerSockets = {};
