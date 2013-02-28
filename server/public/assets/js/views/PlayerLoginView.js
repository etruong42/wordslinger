define(function() {
	var PlayerLoginView = Backbone.View.extend({
		tagName: "div",

		render: function() {
			if(!this.rendered) {
				this.$email = $("<input type='text' class='email' />");
				this.$emailDiv = $("<div></div>")
					.append("<span>Email: </span>")
					.append(this.$email);
				this.$email.keypress($.proxy(this.textEnter, this));

				this.$password = $("<input type='password' class='password' />");
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

		textEnter: function(e) {
			if(e.which == 13) {
				this.login();
			}
		},

		buttonClick: function(e) {
			this.login();
		},

		login: function () {
			//$('.alert-error').hide(); // Hide any errors on a new submit
			var url = '/api/player/login';
			var credentials = {
				email: this.$email.val(),
				password: this.$password.val()
			};
			var that = this;

			$.ajax({
				url: url,
				type: 'POST',
				dataType: "json",
				data: credentials,
				success: function (data) {
					console.log(["Login request details: ", data]);

					if(data.error) {  // If there is an error, show the error messages
						//$('.alert-error').text(data.error.text).show();
						alert(data.error);
					}
					else {
						console.log('triggering player:loggedin');
						that.trigger("player:loggedin", data);
					}
				}
			});
		}
	});
	return PlayerLoginView;
});