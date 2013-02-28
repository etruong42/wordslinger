define([
	'views/PlayerLoginView',
	'views/PlayerSignupView',
	'views/PlayerMenuView',
	'models/WordslingerGame',
	'models/Board',
	'views/BoardView',
	'models/Hand',
	'views/PlayerPanelView',
	'models/Grabbag'
	], function(PlayerLoginView, PlayerSignupView, PlayerMenuView,
		WordslingerGame, Board, BoardView, Hand, PlayerPanelView, Grabbag){
	var WordslingerRouter = Backbone.Router.extend({
		routes: {
			"player/:id": "showPlayer",
			"player": "showLoggedInPlayer",
			"login" : "showLogin",
			"game/:id": "showGame",
			"": "showLogin"
		},

		showPlayer: function(id) {
			console.log("showPlayer:" + id);
		},

		showLoggedInPlayer: function() {
			this.navigate("player");
			if(this.$login) {
				this.$login.empty();
			}
			if(this.$boards) {
				this.$boards.empty();
			}
			console.log("showLoggedInPlayer");
			this.$playermenu = $('#playermenu');
			var playermenu = new PlayerMenuView();
			this.$playermenu.append(playermenu.render().$el);
			playermenu.on("game:created", this.startGame, this);
			playermenu.on("games:retrieved", this.redirectToLogin, this);
			playermenu.on("game:selected",
				function(gameId){
					this.navigate("game/" + gameId, {trigger: true});
				}, this);
		},

		showLogin: function() {
			if(this.$boards) {
				this.$boards.empty();
			}
			console.log("showLogin");
			this.$login = $('#login');
			this.$login.empty();
			var login = new PlayerLoginView();
			var signup = new PlayerSignupView();
			this.$login.append(login.render().$el);
			this.$login.append(signup.render().$el);
			login.on("player:loggedin", this.showLoggedInPlayer, this);
		},

		showGame: function(id) {
			if(this.$playermenu) {
				this.$playermenu.hide();
			}
			console.log("showGame:" + id);
			var h = new Hand();
			var gb = new Grabbag();
			var b = new Board({hands: [h], grabbag: gb});
			this.$boards = $("#boards");

			this.on("gamestatus:retrieved", function(gamedata) {

			});
			this.getGame({gameId: id});
			
			var bv = new BoardView({model:b, height: 15, width: 15, $el : this.$boards});
			var ws = new WordslingerGame({gameId: id});
			ws.board = b;
			ws.grabbag = gb;

			ws.startGame();
		},

		startGame: function(data) {
			if(this.$playermenu) {
				this.$playermenu.hide();
			}
			if(data.route) {
				this.navigate(data.route, {trigger: true});
				return;
			}
			console.log(["show game with data ", data]);

			this.navigate("game/" + data.gameId);

			var tileArray = [
				{letter:"A", points:1, count:9},
				{letter:"B", points:3, count:2},
				{letter:"C", points:3, count:2},
				{letter:"D", points:1, count:5},
				{letter:"E", points:1, count:12},
				{letter:"F", points:4, count:2},
				{letter:"G", points:1, count:5},
				{letter:"H", points:4, count:2},
				{letter:"I", points:1, count:9},
				{letter:"J", points:8, count:1},
				{letter:"K", points:5, count:1},
				{letter:"L", points:1, count:4},
				{letter:"M", points:3, count:2},
				{letter:"N", points:1, count:6},
				{letter:"O", points:1, count:8},
				{letter:"P", points:3, count:2},
				{letter:"Q", points:10, count:1},
				{letter:"R", points:1, count:6},
				{letter:"S", points:1, count:4},
				{letter:"T", points:1, count:6},
				{letter:"U", points:1, count:4},
				{letter:"V", points:4, count:2},
				{letter:"W", points:4, count:2},
				{letter:"X", points:8, count:1},
				{letter:"Y", points:4, count:2},
				{letter:"Z", points:10, count:1},
				{letter:"", points:0, count:2}
			];

			var createPlayerPanel = function(hand) {
				return new PlayerPanelView({hand: hand});
			};

			var h = new Hand();

			var $player = $("div.players")
				.append(createPlayerPanel(h).$el);

			var gb = new Grabbag();
			gb.initTiles(tileArray);
			var b = new Board({hands: [h], grabbag: gb});
			this.$boards = $("#boards");
			var bv = new BoardView({model:b, height: 15, width: 15, $el : $boards});
			var ws = new WordslingerGame({gameId: data.gameId});
			ws.board = b;
			ws.grabbag = gb;

			ws.startGame();
		},

		getGame: function (gameData) {
			//$('.alert-error').hide(); // Hide any errors on a new submit
			var url = '/api/wordslinger/game';
			var that = this;
			$.ajax({
				url: url,
				type: 'POST',
				dataType: "json",
				data: gameData,
				success: function (data) {
					console.log(["Retrieve game request details: ", data]);
					if(data.error) {  // If there is an error, show the error messages
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
				}
			});
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