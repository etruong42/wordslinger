window.Hand = Backbone.Collection.extend({
	model: Tile

	//on push tile, add event to TileView
});

window.HandView = Backbone.View.extend({
	tagName: 'div',
	className: 'hand',

	//bind click of tiles in collection
		//to toggle selected
		//trigger tileSelected (tile)
	initialize: function(options) {
		
	},
	events: {
		"click .tile": "selectTile"
	},

	selectTile: function(evt) {
		var curTile = $(evt.currentTarget);
		if(curTile.hasClass("selected")) {
			curTile.removeClass("selected");
			this.selectedTile = null;
			return;
		}
		if(!curTile.hasClass("selected")) {
			if(this.selectedTile){
				this.selectedTile.removeClass("selected");
			}
			curTile.toggleClass("selected");
			this.selectedTile = curTile;
		}
		
	},

	addTileView: function(tileView) {
		this.el.append(tileView.el);
		this.delegateEvents();
	},

	addTileElement: function(tileElement) {
		this.el.append(tileElement);
		this.delegateEvents();
	},

	render: function(){

	}
});