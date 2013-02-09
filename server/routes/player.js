exports.login = function(req, res) {
	if(true) { //authentication logic
		req.session.user = {isAuthenticated: true, username: 'username'};
	} else {
		res.redirect('/');
	}
};