window.Tile = Backbone.Model.extend({
	defaults: {
		position: {}
	},

	initialize: function() {
		this.tileView = new TileView({model:this});
	},

	select: function() {
		this.tileView.select();
	},

	unselect: function() {
		this.tileView.unselect();
	},

	positionMatch: function(arr) {
		return this.get("position").x === arr[0] &&
			this.get("position").y === arr[1];
	},

	setDraggability: function(bool) {
		if(bool)
			this.tileView.$el.draggable('enable');
		else
			this.tileView.$el.draggable('disable');
	}
});

window.TileView = Backbone.View.extend({
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
		this.template = window.JST['tile'];
		this.$el.html(this.template(this.model.toJSON()));
	},

	select: function() {
		this.$el.addClass("selected");
	},

	unselect: function() {
		this.$el.removeClass("selected");
	}
});