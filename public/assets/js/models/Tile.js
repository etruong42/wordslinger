(function($) {
	window.Tile = Backbone.Model.extend({
		//letter
		//points
		//position, default {}
	});

	window.TileView = Backbone.View.extend({
		tagName: 'span',
		className: 'tile',

		//onclick, toggle selected
		//ondblclick, if has position, clear position, move tile to hand

		initialize: function() {
			this.template = _.template($('#tile-template').html());
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});
})(jQuery);