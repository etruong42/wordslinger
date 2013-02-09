define([
	'jst'
	], function(JST){
	var TileView = Backbone.View.extend({
		tagName: 'span',
		className: 'tile',

		events: {
			"mousedown": "onClick"
		},

		onClick: function() {
			this.model.trigger("tile:select", this.model);
		},

		//onclick, toggle selected

		initialize: function(options) {
			this.template = JST.tile;
			this.$el.html(this.template(this.model.toJSON()));
		},

		select: function() {
			this.$el.addClass("selected");
		},

		unselect: function() {
			this.$el.removeClass("selected");
		}
	});
	return TileView;
});