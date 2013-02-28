define(function() {
	var PlayerMenuView = Backbone.View.extend({
		tagName: "div",

		renderCreateGameButton: function() {
			var $createGame =
				$("<input type='button' value='New Game' />");
			$createGame.click($.proxy(this.newGame, this));
			return $createGame;
		},

		renderGamesMenu: function(data) {
			var that = this;
			var gameId;
			var selectGame = function() {
				console.log("selected game: " + gameId);
				that.trigger("game:selected", gameId);
			};
			this.$gamesmenu = $("<div class='gamesmenu'></div>");
			for(var i=0; i < data.length; i++) {
				var $gamediv = $("<div class='game'></div>");
				var gameData = data[i];
				gameId = gameData._id;
				var $gamedivbutton =
					$("<input type='button' value='Play Game!' />");
				$gamedivbutton.click(selectGame);
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

		newGame: function () {
			//$('.alert-error').hide(); // Hide any errors on a new submit
			var url = '/api/wordslinger/game';
			var that = this;

			$.ajax({
				url: url,
				type: 'POST',
				dataType: "json",
				success: function (data) {
					console.log(["New game request details: ", data]);

					if(data.error) {  // If there is an error, show the error messages
						//$('.alert-error').text(data.error.text).show();
						alert(data.error);
					}
					else {
						console.log('triggering game:created');
						that.trigger("game:created", data);
					}
				}
			});
		},

		getGames: function() {
			var url = '/api/wordslinger/games';
			var that = this;

			$.ajax({
				url: url,
				type: 'GET',
				dataType: "json",
				success: function (data) {
					console.log(["Games request details: ", data]);

					if(data.error) {
						alert(data.error);
					}
					else {
						console.log('triggering games:retrieved');
						that.trigger("games:retrieved", data);
					}
				}
			});
		}
	});

	return PlayerMenuView;
});