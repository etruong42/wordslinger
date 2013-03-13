define([],
	function(){
	var CreateGameView = Backbone.View.extend({
		tagName: "div",
		className: "create-game",

		inititalize: function() {
			this.$invitePlayer =
				$("<input type='text' />");
			this.$createGame =
				$("<input type='button' value='New Game' />");
			$createGame.click($.proxy(this.newGame, this));

			this.$el
				.append("Invite a player: ")
				.append(this.$invitePlayer)
				.append(this.$createGame);
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
		}
	});

	return CreateGameView;
});