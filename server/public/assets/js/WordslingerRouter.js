define(function(){
	var WordslingerRouter = Backbone.Router.extend({
		routes: {
			"player/:id": "showPlayer",
			"player": "showLoggedInPlayer",
			"login" : "showLogin",
			"game/:id": "showGame"
		},

		showPlayer: function(id) {
			console.log("showPlayer:" + id);
		},

		showLoggedInPlayer: function() {
			console.log("showLoggedInPlayer");
		},

		showLogin: function() {
			console.log("showLogin");
		},

		showGame: function(id) {
			console.log("showGame:" + id);
		}
	});

	return WordslingerRouter;
});