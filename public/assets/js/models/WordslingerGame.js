window.WordslingerGame = Backbone.Model.extend({
	initialize: function(options) {
		this.board = options.board;
		this.grabbag = options.grabbag;
		this.set("currentHandIndex", 0);
		this.set("handsize", 7);
		this.currentMove = new Move();

		_.each(this.board.get("hands"), this.initHand, this);

		this.initBoard(this.board);
	},

	initHand: function(hand) {
		hand.on("tile:handslotmove", this.currentMove.removeTile, this.currentMove);
	},

	initBoard: function(board) {
		board.on("tile:boardslotmove",
			this.addTileToCurrentMove, this);
	},

	startGame: function() {
		this.board.startGame();
	},

	setActiveTile: function(tile) {
		this.activeTile = tile;
	},

	addTileToCurrentMove: function(tileAdded) {
		this.currentMove.addTile(tileAdded);
	},

	removeTileFromCurrentMove: function(tileRemoved) {
		this.currentMove.tiles.remove(tileRemoved);
	}
});