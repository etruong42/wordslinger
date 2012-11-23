
	//tile
	//boardposition? board:[tileslot|position]
	window.TileSlot = Backbone.Model.extend({

	});

	window.TileSlotView = Backbone.View.extend({
		tagName: 'div',
		className: 'tileSlot',
		//onclick: if live hand has selected tile, place tile in container
		//with higher z-value

		cleanTiles: function(evt, evt2) {
			this.tile = null;
		},

		initialize: function(options) {
			this.board = options.board;
			_.extend(this, Backbone.Events);
		},

		

		render: function() {
			return this;
		},

		events: {
			"click" : "placeTile",
			"dblclick .active.tile" : "returnTile",
			"wordslinger:tileplace" : "cleanTiles",
			"drop" : "placeDroppedTile"
		},

		placeDroppedTile: function(evt, ui) {

		},

		placeTile: function(evt) {
			this.trigger("wordslinger:tileplace", this.tile);
			if(this.board.activeHand 
				&& this.board.activeHand.selectedTile 
				&& !this.tile) {
				this.tile = this.board.activeHand.selectedTile;
				$(this.el).append(this.tile);
				$(this.tile)
					.toggleClass("active")
					.removeClass("selected");
			}
		},

		returnTile: function(evt) {
			this.board.activeHand.addTileElement(evt.currentTarget);
		}
	});