window.Board = Backbone.Model.extend({
	startGame: function() {
		_.each(this.get("hands"), this.initHand, this);
		this._activeHandIndex = 0;
	},

	initHand: function(hand) {
		hand.grabTiles(this.get("grabbag"), 7);
		hand.handView.render();
	},

	initialize: function(options) {
		this.hands = options.hands;
	},

	getActiveHand: function() {
		return this.hands[this._activeHandIndex];
	},

	tileModifiers: {
		TL: function(tile) {
			return tile.get("score") * 3;
		},

		DL: function(tile) {
			return tile.get("score") * 2;
		}
	},

	scoreModifiers: {
		DW: function(score, tiles) {
			return score * 2;
		},

		TW: function(score, tiles) {
			return score * 3;
		}
	},

	modifiedTiles: {
		TW: [[0,0], [0, 7], [0,14], [7, 0], [14, 0], [14, 7], [14, 14], [7,14]],
		DW: [[1,1],[2,2],[3,3],[4,4],[7,7],[10,10], [11,11], [12,12],[13,13],
				[1,13],[2,12],[3,11],[4,10],[10,4],[11,3],[12,2],[13,1]],

		TL: [[5,1],[5,5],[5,9],[5,13],[9,1],[9,5],[9,9],[9,13],[1,5],[1,9],[13,5],[13,9]],
		DL: [[0,3],[0,11],[2,6],[2,8],[3,0],[3,7],[3,14],
				[6,2],[6,6],[6,8],[6,12],[7,3],[7,11],[8,2],[8,6],[8,8],[8,12],
			[14,3],[14,11],[12,6],[12,8],[11,0],[11,7],[11,14]]
	}
});

window.BoardView = Backbone.View.extend({
	tagName: 'div',
	className: 'board',

	render: function() {
		return 0;
	},

	generateRow: function(length, rowIndex) {
		for(var i = 0; i < length; i++) {
			var tileSlot = new TileSlot({x:i, y:rowIndex, board:this.model});
			this.$el.append(tileSlot.tileSlotView.el);

			tileSlot.tileSlotView.$el.droppable({
				accept: ".tile",
				tolerance: "pointer",
				addClasses: false
			});
		}
	},

	initialize: function(options) {
		this.width = options.width;
		this.height = options.height;
		this.$el = options.$el;
		this.$el.width(this.width * 38);
		this.$el.height(this.height * 38);
		for(var i = 0; i < this.height; i++) {
			this.generateRow(this.width, i);
		}
	}
});
