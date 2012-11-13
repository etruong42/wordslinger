
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
			console.log(evt);
			console.log(evt2);
		},

		initialize: function(options) {
			this.board = options.board;
		},

		

		render: function() {
			return this;
		},

		events: {
			"click" : "placeTile",
			"dblclick .active.tile" : "returnTile"
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