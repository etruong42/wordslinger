define([
	'models/Hand',
	'models/Board',
	'views/BoardView',
	'models/Move',
	'views/PlayerPanelView'
	], function(Hand, Board, BoardView, Move, PlayerPanelView){
	var WordslingerGame = Backbone.Model.extend({
		url: "/api/wordslinger/game",
		initialize: function(options) {
			this.set("currentHandIndex", 0);
			this.set("handsize", 7);
			this.on("move:submitted", this.updateHand);
			var h = new Hand();
			this.board = new Board({hands: [h], $el: options.$el});
			this.board.boardView =
				new BoardView({model:this.board, height: 15, width: 15});
			this.board.boardView.render().$el.appendTo(options.$el);
			var $player = $("<div class='players'></div>");
			this.playerPanelView = new PlayerPanelView({hand: h, game: this});
			this.playerPanelView.$el.append();
			$player
				.append(this.playerPanelView.$el)
				.appendTo(options.$el);
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

			this.board.startGame();
		},

		populate: function(data) {
			this.board.populate(data);
			var playerscore = _.chain(data.moves)
				.filter(function(a){return a.playerId == data.yourId;})
				.pluck('points')
				.reduce(function(sum, a){return sum+a;}, 0).value();
			this.setPlayerScore(playerscore);
			this.playerPanelView.setIsYourTurn(data.isYourTurn);
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
			this.currentMove.set({points: moveScore});
			this.incPlayerScore(moveScore);
			this.currentMove.set({gameId: this.get("gameId")});
			this.submitMove(this.currentMove.toJSON());
			this.initMove(); //init next move

			this.board.getActiveHand()
				.updateCurrentMoveScore(0)
				.endTurn(this.currentMove.tiles);

			this.board.addMove(this.currentMove);
			this.playerPanelView.setIsYourTurn(false);
		},

		setPlayerScore: function(val) {
			var $playerscore = $(this.board.getActiveHand().handView.$el.parent())
				.find(".handscore");
			$playerscore.html(val);
		},

		incPlayerScore: function(val) {
			var $playerscore = $(this.board.getActiveHand().handView.$el.parent())
				.find(".handscore");

			var playerscore = parseInt($playerscore.html(), 10);

			if(!playerscore) {
				playerscore = 0;
			}
			playerscore += val;
			$playerscore.html(playerscore);
		},

		submitMove: function(move) {
			var url = '/api/wordslinger/move';
			var that = this;

			$.ajax({
				url: url,
				type: 'POST',
				dataType: "json",
				data: move,
				success: function (data) {
					console.log(["Submit move data: ", data]);

					if(data.error) {  // If there is an error, show the error messages
						//$('.alert-error').text(data.error.text).show();
						alert(data.error);
					}
					else {
						console.log('triggering move:submitted');
						that.trigger("move:submitted", data);
					}
				}
			});
		}
	});
	return WordslingerGame;
});
