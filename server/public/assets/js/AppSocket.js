define([], function() {
	var socket = io.connect('http://localhost');
	socket.wordslinger = {};
	socket.on('playerId', function(data){
		socket.wordslinger.playerId = data;
	});
	return socket;
});