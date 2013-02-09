exports.sendMove = function(req, res) {
	//req.cookies.cookieName
	//get the cookie with the name 'cookieName'
	//req.sessionID
	console.log('incoming request with sessionID' + req.sessionID);
	console.log(req.sessionID);
	res.send("Move sent to server; implement consumption: " + req.sessionID);
};