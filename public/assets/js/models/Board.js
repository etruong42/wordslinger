(function($) {
	window.Board = Backbone.Collection.extend({
		// defaults {
		// 	height: 0,
		// 	width: 0,
		// 	tiles = [][];
		// }

		//model: tile
		//fetch: boardview 'listening' for state change

		//players
		//activePlayerIndex
	});

	window.BoardView = Backbone.View.extend({
		tagName: 'div',
		className: 'board',

		//bind to window keypress
		//check existence of letter
		//internationalization: update textbox with typed letter
		//if typed is 'backspace', 'delete', etc
		//remove last tile from board
		//check for existence of typed letter
		//if typed letter exists in hand, add tile to Move, trigger tileAdded

		//bind click to collection of tiles
		//if current hand has selected tile
		//and clicked spot is empty
		//place selected tile onto clicked empty tile
		render: function() {
			
 		},

 		generateRow: function(length) {
 			var t = [];
 			for(var i = 0; i < length; i++) {
 				var newTileSlotView = new TileSlotView({board: this.model});
				newTileSlotView.on("wordslinger:tileplace", newTileSlotView.cleanTiles, newTileSlotView)
 				this.$el.append(newTileSlotView.el);
 			}
 		},		

		initialize: function(options) {
			this.width = options.width;
			this.height = options.height;
			this.$el = options.$el;
			this.tiles = [];
			this.generateRow(this.width);

			//feed tileslots and tiles
			//in turn, define their container

			//on collection added to, render added tiles onto board
		}
	});
})(jQuery);