define([
	'models/Move',
	'views/EndTurnView'
	], function(Move, EndTurnView){
	var WordslingerGame = Backbone.Model.extend({
		url: "/api/wordslinger/game",
		initialize: function(options) {
			//this.board = options.board;
			//this.grabbag = options.grabbag;
			this.set("currentHandIndex", 0);
			this.set("handsize", 7);
		},

		initMove: function() {
			this.currentMove = new Move();
			this.currentMove.board = this.board;
		},

		initHand: function(hand) {
			hand.on("tile:handslotmove", this.removeTileFromCurrentMove, this);
		},

		initBoard: function(board) {
			board.on("tile:boardslotmove",
				this.addTileToCurrentMove, this);
		},

		startGame: function() {
			this.initMove();
			_.each(this.board.get("hands"), this.initHand, this);
			this.initBoard(this.board);
			var endTurnView = new EndTurnView({game: this});
			endTurnView.$el.appendTo("div.players");

			this.board.startGame();

			this.save({
				success: function() {
					//turn loading button into play turn
				}
			});
		},

		setActiveTile: function(tile) {
			this.activeTile = tile;
		},

		addTileToCurrentMove: function(tileAdded) {
			this.currentMove.addTile(tileAdded);
			this.board.getActiveHand()
				.updateCurrentMoveScore(this.currentMove.getTotalScore());
		},

		removeTileFromCurrentMove: function(tileRemoved) {
			this.currentMove.removeTile(tileRemoved);
			this.board.getActiveHand()
				.updateCurrentMoveScore(this.currentMove.getTotalScore());
		},

		endCurrentTurn: function() {
			var moveScore = this.currentMove.getTotalScore();
			if(!moveScore) {
				return; //not valid move
			}

			this.board.getActiveHand()
				.updateCurrentMoveScore(0)
				.endTurn(this.currentMove.tiles)
				.grabTiles(this.grabbag, this.currentMove.tiles.length)
				.handView.render();

			this.board.addMove(this.currentMove);

			var handscoreEl = $(this.board.getActiveHand().handView.$el.parent())
				.find(".handscore");

			var handscore = parseInt(handscoreEl.html(), 10);

			if(!handscore) {
				handscore = 0;
			}

			handscore += moveScore;
			this.currentMove.set({gameId: this.get("gameId")});
			this.currentMove.save();
			handscoreEl.html(handscore);
			this.initMove();
			this.board.nextHand();
		}
	});
	
	return WordslingerGame;
});
