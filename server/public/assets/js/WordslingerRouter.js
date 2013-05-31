define([
	'views/PlayerLoginView',
	'views/PlayerSignupView',
	'views/PlayerMenuView',
	'models/WordslingerGame',
	'models/Board',
	'views/BoardView',
	'AppSocket'
	], function(PlayerLoginView, PlayerSignupView, PlayerMenuView,
		WordslingerGame, Board, BoardView, AppSocket){
	var WordslingerRouter = Backbone.Router.extend({
		routes: {
			"player/:id": "showPlayer", //not yet implemented
			"player": "showLoggedInPlayer",
			"login" : "showLogin",
			"game/:id": "showGame",
			"logout" : "logout",
			"": "showLoggedInPlayer"
		},

		initialize: function() {
			this.$container = $(".gamecontainer");
			var that = this;
			AppSocket.on('playerInfo', function(data){
				AppSocket.wordslinger.playerInfo = data;
				that.navigate("player", {trigger: true});
			});
			AppSocket.on('getgameresponse', function (data) {
				console.log(["getgameresponse ", data]);
				if(data.error) {
					// If there is an error, show the error messages
					//$('.alert-error').text(data.error.text).show();
					alert(data.error);
				}
				else if(data.route) {
					that.redirectToLogin(data);
				}
				else {
					console.log('triggering gamestatus:retrieved');
					that.trigger("gamestatus:retrieved", data);
				}
			});
		},

		logout: function() {
			console.log("logout");
		},

		showPlayer: function(id) {
			console.log("showPlayer:" + id);
		},

		showLoggedInPlayer: function() {
			this.navigate("player");
			console.log("showLoggedInPlayer");
			this.$container.empty();
			var playermenu = new PlayerMenuView();
			this.$container.append(playermenu.render().$el);
			playermenu.on("game:created", this.startGame, this);
			playermenu.on("games:retrieved", this.redirectToLogin, this);
			playermenu.on("game:selected",
				function(gameId){
					this.navigate("game/" + gameId, {trigger: true});
				}, this);
		},

		showLogin: function() {
			console.log("showLogin");
			this.$container.empty();
			var login = new PlayerLoginView();
			var signup = new PlayerSignupView();
			this.$container.append(login.render().$el);
			this.$container.append(signup.render().$el);
			login.on("player:loggedin", this.showLoggedInPlayer, this);
		},

		showGame: function(id) {
			this.$container.empty();
			console.log("showGame:" + id);

			var wg = new WordslingerGame({gameId: id, $el: this.$container});
			this.on("gamestatus:retrieved", function(gameData) {
				wg.populate(gameData);
				this.off();
			});
			this.getGame({gameId: id});

			wg.startGame();
		},

		startGame: function(data) {
			if(data.route) {
				this.navigate(data.route, {trigger: true});
				return;
			}
			console.log(["show game with data ", data]);
			this.navigate("game/" + data.gameId);
			this.$container.empty();
			var wg = new WordslingerGame({
				gameId: data.gameId, $el: this.$container});
			wg.startGame();
			wg.populate(data);
		},

		getGame: function (gameData) {
			//$('.alert-error').hide(); // Hide any errors on a new submit
			var url = '/api/wordslinger/game';
			//gameData.gameId
			AppSocket.emit('getgame', gameData);
		},

		redirectToLogin: function(data) {
			var redirect = false;
			if(!data) {
				this.navigate('login', {trigger: true});
				redirect = true;
			} else if(data.route) {
				this.navigate(data.route, {trigger: true});
				redirect = true;
			}

			if(redirect) {
				if(this.$playermenu) {
					this.$playermenu.empty();
				}
			}
		}
	});

	return WordslingerRouter;
});