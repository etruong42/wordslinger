define(
	[
	"Board",
	"Move",
	"Tile"
	], function (Board, Move, Tile) {
		var moveTestGlobal = {};
		moveTestGlobal.addTileToMove = function(move, letter, points, x, y) {
			move.addTile(new Tile({
				letter: letter,
				points: points,
				position: {
					x: x,
					y: y
				}
			}));
		};
		var test1 = function () {
			var move = new Move();
			move.board = new Board({hands: []});
			move.board.set({tiles: []});
			var board = move.board;
			moveTestGlobal.addTileToMove(move, "w", 4, 6, 7);
			moveTestGlobal.addTileToMove(move, "i", 1, 7, 7);
			moveTestGlobal.addTileToMove(move, "f", 4, 8, 7);
			moveTestGlobal.addTileToMove(move, "e", 1, 9, 7);
			equal(move.getTotalScore(), 20);
			var numBoardTiles = move.board.get("tiles").length;
			move.board.addMove(move);
			//equal(numBoardTiles + move.length, move.board.get("tiles").length);

			move = new Move();
			move.board = board;
			moveTestGlobal.addTileToMove(move, "d", 1, 7, 6);
			moveTestGlobal.addTileToMove(move, "i", 1, 8, 6);
			moveTestGlobal.addTileToMove(move, "l", 1, 9, 6);
			moveTestGlobal.addTileToMove(move, "d", 1, 10, 6);
			moveTestGlobal.addTileToMove(move, "o", 1, 11, 6);
			equal(move.getTotalScore(), 16);

			numBoardTiles = move.board.get("tiles").length;
			move.board.addMove(move);
			//equal(numBoardTiles + move.length, move.board.get("tiles").length);

			move = new Move();
			move.board = board;
			moveTestGlobal.addTileToMove(move, "a", 1, 9, 5);
			moveTestGlobal.addTileToMove(move, "o", 1, 10, 5);
			equal(move.getTotalScore(), 11);

			numBoardTiles = move.board.get("tiles").length;
			move.board.addMove(move);
			//equal(numBoardTiles + move.length, move.board.get("tiles").length);

			move = new Move();
			move.board = board;
			moveTestGlobal.addTileToMove(move, "t", 1, 9, 4);
			moveTestGlobal.addTileToMove(move, "a", 1, 10, 4);
			moveTestGlobal.addTileToMove(move, "d", 1, 11, 4);
			equal(move.getTotalScore(), 16);

			numBoardTiles = move.board.get("tiles").length;
			move.board.addMove(move);
			//equal(numBoardTiles + move.length, move.board.get("tiles").length);
		};

		var test2 = function() {
			var theMove = new Move();
			theMove.board = new Board({hands: []});
			var board = theMove.board;
			theMove.board.set({tiles: []});
			moveTestGlobal.addTileToMove(theMove, "k", 4, 6, 7);
			moveTestGlobal.addTileToMove(theMove, "i", 1, 7, 7);
			moveTestGlobal.addTileToMove(theMove, "n", 1, 8, 7);
			equal(theMove.getTotalScore(), 12);
			var numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);

			theMove = new Move();
			theMove.board = board;
			moveTestGlobal.addTileToMove(theMove, "d", 1, 9, 7);
			equal(theMove.getTotalScore(), 7);
			numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);
		};

		var test3 = function() {
			var theMove = new Move();
			theMove.board = new Board({hands: []});
			var board = theMove.board;
			theMove.board.set({tiles: []});
			moveTestGlobal.addTileToMove(theMove, "y", 4, 7, 7);
			moveTestGlobal.addTileToMove(theMove, "a", 1, 8, 7);
			equal(theMove.getTotalScore(), 10);
			var numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);

			theMove = new Move();
			theMove.board = board;
			moveTestGlobal.addTileToMove(theMove, "d", 1, 7, 5);
			moveTestGlobal.addTileToMove(theMove, "a", 1, 7, 6);
			equal(theMove.getTotalScore(), 6);
			numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);
		};

		var test4 = function() {
			var theMove = new Move();
			theMove.board = new Board({hands: []});
			var board = theMove.board;
			theMove.board.set({tiles: []});
			moveTestGlobal.addTileToMove(theMove, "g", 3, 7, 5);
			moveTestGlobal.addTileToMove(theMove, "u", 1, 7, 6);
			moveTestGlobal.addTileToMove(theMove, "t", 3, 7, 7);
			equal(theMove.getTotalScore(), 14);
			var numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);

			theMove = new Move();
			theMove.board = board;
			moveTestGlobal.addTileToMove(theMove, "m", 3, 5, 7);
			moveTestGlobal.addTileToMove(theMove, "a", 1, 6, 7);
			equal(theMove.getTotalScore(), 7);
			numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);
		};

		var test5 = function() {
			var theMove = new Move();
			theMove.board = new Board({hands: []});
			var board = theMove.board;
			theMove.board.set({tiles: []});
			moveTestGlobal.addTileToMove(theMove, "m", 3, 7, 7);
			moveTestGlobal.addTileToMove(theMove, "a", 1, 8, 7);
			moveTestGlobal.addTileToMove(theMove, "s", 1, 9, 7);
			moveTestGlobal.addTileToMove(theMove, "t", 1, 10, 7);
			equal(theMove.getTotalScore(), 12);
			var numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);

			theMove = new Move();
			theMove.board = board;
			moveTestGlobal.addTileToMove(theMove, "o", 1, 7, 8);
			moveTestGlobal.addTileToMove(theMove, "a", 1, 7, 9);
			moveTestGlobal.addTileToMove(theMove, "t", 1, 7, 10);
			equal(theMove.getTotalScore(), 6);
			numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);

			theMove = new Move();
			theMove.board = board;
			moveTestGlobal.addTileToMove(theMove, "a", 1, 9, 8);
			moveTestGlobal.addTileToMove(theMove, "n", 1, 9, 9);
			moveTestGlobal.addTileToMove(theMove, "k", 5, 9, 10);
			equal(theMove.getTotalScore(), 10);
			numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);

			theMove = new Move();
			theMove.board = board;
			moveTestGlobal.addTileToMove(theMove, "p", 3, 6, 9);
			moveTestGlobal.addTileToMove(theMove, "i", 1, 8, 9);
			equal(theMove.getTotalScore(), 6);
			numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);
		};
		var test6 = function() {
			var theMove = new Move();
			theMove.board = new Board({hands: []});
			var board = theMove.board;
			theMove.board.set({tiles: []});
			moveTestGlobal.addTileToMove(theMove, "m", 3, 7, 7);
			moveTestGlobal.addTileToMove(theMove, "a", 1, 7, 8);
			equal(theMove.getTotalScore(), 8);
			var numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);

			theMove = new Move();
			theMove.board = board;
			moveTestGlobal.addTileToMove(theMove, "x", 8, 8, 8);
			equal(theMove.getTotalScore(), 17);
			numBoardTiles = theMove.board.get("tiles").length;
			theMove.board.addMove(theMove);
			//equal(numBoardTiles + theMove.length, theMove.board.get("tiles").length);
		};
		return {
			RunTest1: function () {
				test("wife -> dildo -> ao -> tad", test1);
			},

			RunTest2: function() {
				test("kin -> kind; goingForward", test2);
			},

			RunTest3: function() {
				test("ya -> day; goingForward", test3);
			},

			RunTest4: function() {
				test("gum -> mom; goingForward", test4);
			},

			RunTest5: function() {
				test("mast -> moat -> sank -> pain; between", test5);
			},

			RunTest6: function() {
				test("ma -> ax; goingForward", test6);
			}
		};
	});