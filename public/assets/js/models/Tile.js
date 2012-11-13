window.Tile = Backbone.Model.extend({
	//letter
	//points
	//position, default {}
});

window.TileView = Backbone.View.extend({
	tagName: 'div',
	className: 'tile',

	//onclick, toggle selected
	//ondblclick, if has position, clear position, move tile to hand

	initialize: function(options) {
		this.model = options.model;
		this.template = window.JST['tile'];
		$(this.el).html(this.template(this.model.toJSON()));
	},

	render: function() {
		return this;
	}
});