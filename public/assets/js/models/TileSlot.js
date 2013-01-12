window.TileSlot = Backbone.Model.extend({
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

window.TileSlotView = Backbone.View.extend({
	tagName: 'div',
	className: 'tileSlot',

	initialize: function(options) {
		this.board = options.board;
	},

	render: function() {
		return this;
	},

	events: {
		"click" : "placeTile",
		"dblclick .selected.tile" : "returnTileEvent",
		"drop" : "dropTile"
	},

	placeTile: function() {
		var selected = this.board.getActiveHand().selectedTile;
		if(selected) {
			this.$el.append(selected.tileView.$el.attr("style", null));
			selected.set({position: {x: this.model.x, y: this.model.y}});
			this.board.trigger("tile:boardslotmove", selected);
		}
	},

	dropTile: function(draggable, ui) {
		if(!this.$el.is(":empty")) {
			ui.draggable.animate(
				{left: 0, top: 0},
				500
			);
			return;
		}
		this.placeTile();
	},

	returnTileEvent: function(evt) {
		this.returnTile(evt.currentTarget);

	},

	returnTile: function(tileEl) {
		this.board.getActiveHand().handView.getFirstEmpty()
			.append(tileEl);
		this.board.getActiveHand().trigger("tile:handslotmove", this.board.getActiveHand().selectedTile);
	}
});