define([], function() {
	var socket = io.connect('/');
	socket.wordslinger = socket.wordslinger || {};
	socket.wordslinger.playerInfo =
		socket.wordslinger.playerInfo || {};
	return socket;
});