define([
	'views/EndTurnView'
	], function(EndTurnView){
	var PlayerPanelView = Backbone.View.extend({
		tagName: "div",
		className: "playerPanel",

		initialize: function(options) {
			//TODO: use DOM fragments here first
			this.endTurnView = new EndTurnView({game: options.game});
			this.$el.append(options.hand.handView.render().$el)
				.append(this.endTurnView.$el)
				.append("<span class='handscore handhelp'>0</span>")
				.append("<span class='movescore handhelp'>0</span>");
		},

		setIsYourTurn: function(bool) {
			if(bool) {
				this.endTurnView.enable();
			}
			else {
				this.endTurnView.disable();
			}
		}
	});
	return PlayerPanelView;
});