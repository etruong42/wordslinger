window.WordslingerGame = Backbone.Model.extend({
	initialize: function(options) {
		this.board = options.board;
		this.grabbag = options.grabbag;
		this.set("currentHandIndex", 0);
		this.set("handsize", 7);

		this.initMove();

		_.each(this.board.get("hands"), this.initHand, this);

		this.initBoard(this.board);

		var endTurnView = new EndTurnView({game: this});
		endTurnView.$el.appendTo("div.players");
	},

	initMove: function() {
		this.currentMove = new Move(/*{board: this.board}*/);
		this.currentMove.board = this.board;
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
	},

	endCurrentTurn: function() {
		var moveScore = this.currentMove.getTotalScore();
		if(!moveScore) {
			return; //not valid move
		}

		this.board.getActiveHand()
			.endTurn(this.currentMove.models)
			.grabTiles(this.grabbag, this.currentMove.models.length)
			.handView.render();

		this.board.addMove(this.currentMove);

		var handscoreEl = $(this.board.getActiveHand().handView.$el.parent())
			.find(".handscore");

		var handscore = parseInt(handscoreEl.html(), 10);

		if(!handscore) {
			handscore = 0;
		}

		handscore += moveScore;

		handscoreEl.html(handscore);

		this.initMove();
		this.board.nextHand();
	}
});