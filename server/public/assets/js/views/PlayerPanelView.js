define([
	'views/EndTurnView'
	], function(EndTurnView){
	var PlayerPanelView = Backbone.View.extend({
		tagName: "div",
		className: "playerPanel",

		initialize: function(options) {
			//TODO: use DOM fragments here first
			this.$el.append(options.hand.handView.render().$el)
				.append((new EndTurnView({game: options.game})).$el)
				.append("<span class='handscore handhelp'>0</span>")
				.append("<span class='movescore handhelp'>0</span>");
		}
	});
	return PlayerPanelView;
});