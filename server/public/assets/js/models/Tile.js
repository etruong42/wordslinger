define([
	'views/TileView'
	],	function(TileView){
	Tile = Backbone.Model.extend({
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
	return Tile;
});