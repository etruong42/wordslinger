define(function() {
	var EndTurnView = Backbone.View.extend({
		tagName: "input",
		className: "endTurn",

		initialize: function(options) {
			this.game = options.game;
			this.$el.attr("type", "button");
			this.$el.attr("value", "Play Turn");
			this.disable();
		},

		events: {
			"click": "endTurn"
		},

		endTurn: function() {
			this.game.endCurrentTurn();
		},

		enable: function() {
			this.$el.removeAttr('disabled');
		},

		disable: function() {
			this.$el.attr('disabled', 'disabled');
		}
	});

	return EndTurnView;
});