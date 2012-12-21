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
	//ondblclick, if has position, clear position, move tile to hand

	initialize: function(options) {
		this.template = window.JST['tile'];
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.draggable({
			revert: "invalid",
			appendTo: ".tileSlot",
			addClasses: false
		});
	},

	select: function() {
		this.$el.addClass("selected");
	},

	unselect: function() {
		this.$el.removeClass("selected");
	}
});