define(function() {
	var EndTurnView = Backbone.View.extend({
		tagName: "input",
		className: "endTurn",

		initialize: function(options) {
			this.game = options.game;
			this.$el.attr("type", "button");
			this.$el.attr("value", "Play Turn");
		},

		events: {
			"click": "endTurn"
		},

		endTurn: function() {
			this.game.endCurrentTurn();
		}
	});

	return EndTurnView;
});