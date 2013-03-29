define([], function() {
	var socket = io.connect('/');
	socket.wordslinger = {};
	socket.on('playerId', function(data){
		socket.wordslinger.playerId = data;
	});
	return socket;
});