define(function() {
	var PlayerSignupView = Backbone.View.extend({
		tagName: "div",

		render: function() {
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

			this.$confirmPassword = $("<input type='password' class='confirmPassword' />");
			this.$confirmPasswordDiv = $("<div></div>")
				.append("<span>Confirm Password: </span>")
				.append(this.$confirmPassword);
			this.$confirmPassword.keypress($.proxy(this.textEnter, this));

			this.$submit = $("<input type='button' value='Signup' />");
			this.$submit.keypress($.proxy(this.textEnter, this));
			this.$submit.click($.proxy(this.buttonClick, this));

			this.$el
				.append("<h2>Signup</h2>")
				.append(this.$emailDiv)
				.append(this.$passwordDiv)
				.append(this.$confirmPasswordDiv)
				.append(this.$submit);

			return this;
		},

		textEnter: function(e) {
			if(e.which == 13) {
				this.signup();
			}
		},

		buttonClick: function(e) {
			this.signup();
		},

		signup: function () {
			//$('.alert-error').hide(); // Hide any errors on a new submit
			var url = '/api/player/signup';
			var formValues = {
				email: this.$email.val(),
				password: this.$password.val(),
				confirmpassword: this.$confirmPassword.val()
			};

			$.ajax({
				url:url,
				type:'POST',
				dataType: "json",
				data: formValues,
				success:function (data) {
					if(data.error) {  // If there is an error, show the error messages
						//$('.alert-error').text(data.error.text).show();
						alert(data.error);
					}
					else { // If not, send them back to the home page
						window.location.replace('#');
					}
				}
			});
		}
	});
	return PlayerSignupView;
});