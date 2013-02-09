define([
	'views/TileSlotView'
	], function(TileSlotView) {
	var TileSlot = Backbone.Model.extend({
		defaults: {
			scoreModifier: null,
			tileModifier: null
		},

		initialize: function(options) {
			this.tileSlotView = new TileSlotView({model: this, board: options.board});
			if(!options.board.tileslots[options.x]){
				options.board.tileslots[options.x] = [];
			}

			options.board.tileslots[options.x][options.y] = this;
			this.x = options.x;
			this.y = options.y;
			modifierTileEquals = function(a) {
				return a[0] == options.x && a[1] == options.y;
			};
			for(var modifierKey in options.board.modifiedTiles) {
				window.a = modifierKey;
				var modifierTiles = options.board.modifiedTiles[modifierKey];
				if(_.any(modifierTiles, modifierTileEquals)) {
					this.set({tileModifier: options.board.tileModifiers[modifierKey]});
					this.set({scoreModifier: options.board.scoreModifiers[modifierKey]});
					this.tileSlotView.$el.addClass(modifierKey);
				}
			}

		}
	});

	return TileSlot;
});