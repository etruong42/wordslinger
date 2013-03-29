define(['AppSocket'], function(AppSocket) {
	var PlayerLoginView = Backbone.View.extend({
		tagName: "div",

		render: function() {
			if(!this.rendered) {
				this.$email =
					$("<input type='text' class='email' />");
				this.$emailDiv = $("<div></div>")
					.append("<span>Email: </span>")
					.append(this.$email);
				this.$email.keypress($.proxy(this.textEnter, this));

				this.$password =
					$("<input type='password' class='password' />");
				this.$passwordDiv = $("<div></div>")
					.append("<span>Password: </span>")
					.append(this.$password);
				this.$password.keypress($.proxy(this.textEnter, this));

				this.$submit = $("<input type='button' value='Login' />");
				this.$submit.keypress($.proxy(this.textEnter, this));
				this.$submit.click($.proxy(this.buttonClick, this));

				this.$el
					.append("<h2>Login</h2>")
					.append(this.$emailDiv)
					.append(this.$passwordDiv)
					.append(this.$submit);
			}

			this.rendered = true;

			return this;
		},

		initialize: function() {
			var that = this;
			AppSocket.on('loginresponse', function(data) {
				console.log(["Login request details: ", data]);
				AppSocket.wordslinger.playerId = data._id;
				console.log("appsocket!!!"+AppSocket.wordslinger.playerId);
				if(data.error) {
					// If there is an error, show the error messages
					//$('.alert-error').text(data.error.text).show();
					alert(data.error);
				}
				else {
					console.log('triggering player:loggedin');
					that.trigger("player:loggedin", data);
				}
			});
		},

		textEnter: function(e) {
			if(e.which == 13) {
				this.login();
			}
		},

		buttonClick: function(e) {
			this.login();
		},

		login: function () {
			var credentials = {
				email: this.$email.val(),
				password: this.$password.val()
			};
			AppSocket.emit('login', credentials);
			//var url = '/api/player/login';
		}
	});
	return PlayerLoginView;
});