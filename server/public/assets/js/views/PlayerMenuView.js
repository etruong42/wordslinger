define(['AppSocket'], function(AppSocket) {
	var PlayerMenuView = Backbone.View.extend({
		tagName: "div",

		initialize: function() {
			this.on("game:error", this.alertError);
			var that = this;
			AppSocket.on('gamesresponse', function (data) {
				console.log(["Games request details: ", data]);

				if(data.error) {
					alert(data.error);
				}
				else {
					console.log('triggering games:retrieved');
					that.trigger("games:retrieved", data);
				}
			});
			AppSocket.on('newgameresponse', function (data) {
				console.log(["New game request details: ", data]);

				if(data.error) {
					// If there is an error, show the error messages
					//$('.alert-error').text(data.error.text).show();
					alert(data.error);
				}
				else {
					console.log('triggering game:created');
					that.trigger("game:created", data);
				}
			});
		},

		events: {
			"game:error": "alertError"
		},

		alertError: function(error) {
			alert(error);
		},

		renderCreateGameButton: function() {
			var $createGame = $("<div class='create-game'></div>");
			var $playerInvite = $("<input type='text' />");
			var $createGameButton =
				$("<input type='button' value='New Game' />");
			$createGame
				.append("Enter opponent's email address: ")
				.append($playerInvite)
				.append($createGameButton);
			$playerInvite.keypress(
				$.proxy(this.newGameKeyPress($playerInvite), this)
			);
			$createGameButton.click($.proxy(this.newGame($playerInvite), this));
			return $createGame;
		},

		newGameKeyPress: function($playerInvite) {
			var that = this;
			return function(e) {
				if(e.which == 13) {
					this.newGame($playerInvite)();
				}
			};
		},

		renderGamesMenu: function(data) {
			var that = this;
			var selectGame = function(gameId) {
				return function() {
					console.log("selected game: " + gameId);
					that.trigger("game:selected", gameId);
				};
			};
			this.$gamesmenu = $("<div class='gamesmenu'></div>");
			for(var i=0; i < data.length; i++) {
				var $gamediv = $("<div class='game'></div>");
				var gameData = data[i];
				var gameId = gameData._id;
				var $gamedivbutton =
					$("<input type='button' value='Play Game!' />");
				$gamedivbutton.click(selectGame(gameId));
				$gamediv
					.append($gamedivbutton)
					.appendTo(this.$gamesmenu);
			}
			console.log(["triggering gamesmenu:rendered", this.$gamesmenu]);
			this.trigger("gamesmenu:rendered", this.$gamesmenu);
		},

		render: function() {
			this.on("games:retrieved", this.renderGamesMenu, this);
			this.getGames();
			this.$el.empty();
			var $outergamesmenu = $("<div class='outergamesmenu'></div>");
			this.$el.append($outergamesmenu);
			this.$el.append(this.renderCreateGameButton());
			this.on("gamesmenu:rendered", function(a){$outergamesmenu.append(a);});
			return this;
		},

		newGame: function ($playerInvite) {
			//$('.alert-error').hide(); // Hide any errors on a new submit
			//var url = '/api/wordslinger/game';
			return function() {
				var players = $playerInvite.val();
				if(!players) {
					that.trigger("game:error",
						"Please enter the opponent's email address");
					return;
				}
				AppSocket.emit('newgame', {players: players});
			};
		},

		getGames: function() {
			AppSocket.emit('games', {});
			//var url = '/api/wordslinger/games';
		}
	});

	return PlayerMenuView;
});