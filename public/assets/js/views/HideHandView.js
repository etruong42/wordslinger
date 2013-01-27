define(function() {
	var HideHandView = Backbone.View.extend({
		tagName: "input",
		className: "showHideHand handhelp",
		events: {
			"click" : "toggleVisibility"
		},

		initialize: function(options) {
			this.hand = options.hand;
			this.$el.attr("type", "button");
			this.setHandVisibility(this.hand, this.hand.visible);
		},

		toggleVisibility: function() {
			var hand = this.$el.parent().find(".hand");
			this.hand.visible = !this.hand.visible;
			this.setHandVisibility(this.hand, this.hand.visible);
		},

		setHandVisibility: function(hand, visibility) {
			if(visibility) {
				hand.handView.$el.show();
				this.$el.attr("value", "hide");
			}
			else {
				hand.handView.$el.hide();
				this.$el.attr("value", "show");
			}
		}
	});

	return HideHandView;
});