define(function(){
	var PlayerPanelView = Backbone.View.extend({
		tagName: "div",
		className: "playerPanel",

		initialize: function(options) {
			//TODO: use DOM fragments here first
			this.$el.append(options.hand.handView.$el);
			var button = options.hand.visibilityControl;
			this.$el.append(button.$el);
			this.$el.append("<span class='handscore handhelp'>0</span>");
			this.$el.append("<span class='movescore handhelp' style='display:none'>0</span>");
		}
	});
	return PlayerPanelView;
});