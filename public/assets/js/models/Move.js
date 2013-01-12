window.Move = Backbone.Collection.extend({

	initialize: function(options){
	},

	addTile: function(tile) {
		this.removeTile(tile);
		this.push(tile);
	},

	removeTile: function(tile) {
		this.remove(
			this.filter(
				function(a){
					return a.cid === tile.cid;
				}));
	},

	getTotalScore: function() {
		var words = []; //words that will need to be validated
		var countingTiles = [];
		var orientation = this.getOrientation(); //sets comparator
		if(!orientation){
			return null;
		}
		this.sort();
		var axis, antiaxis;
		if(orientation === "vert") {
			axis = "y";
			antiaxis = "x"; //all move tiles are on antiaxis
		}
		if(orientation === "hori") {
			axis = "x";
			antiaxis = "y";
		}

		//console.log("axis: " + axis);
		//console.log("antiaxis: " + antiaxis);

		var firstTile = this.at(0);

		//console.log("firstTile:");
		//console.log(firstTile);
		//console.log("move:");
		//console.log(this);

		if(!firstTile) {
			return 0; //0 points for no tiles
		}

		var minaxiscoord = firstTile.get("position")[axis];
		var antiaxiscoord = firstTile.get("position")[antiaxis];
		//console.log("minaxiscoord: " + minaxiscoord);
		//console.log("antiaxiscoord: " + antiaxiscoord);

		var goingBack = true;

		var runningScore = 0;
		var scoreModifiers = [];
		var postScore = 0;
		var baseCoord = null;

		var boardTilesOnAxis = this.board.getTilesOnAxis(antiaxis, antiaxiscoord);
		//console.log("boardTilesOnAxis");
		//console.log(boardTilesOnAxis);
		var goingBackCounter = minaxiscoord - 1;

		var tileOnAxis = function(tile) {
			return tile.get("position")[axis] === goingBackCounter;
		};

		while(goingBack) {
			if(goingBackCounter > -1) {
				var goingBackTile = _.find(boardTilesOnAxis, tileOnAxis);
				if(goingBackTile) {
					runningScore += goingBackTile.get("points");
					goingBackCounter--;
					continue;
				}
			}
			goingBack = false;
		}

		//possible opt: filter tileModifiers to ones on axis to
		//reduce iteration scope of following loop

		for(var i = 0; i < this.length; i++) {
			var tile = this.at(i);
			if(!baseCoord) {
				baseCoord = tile.get("position")[axis];
			}
			else if(baseCoord !== tile.get("position")[axis] - 1) {
				//check board already have tile
				return null;
			}
			baseCoord = tile.get("position")[axis];
			var tileModifier = null;
			for(var modifyKey in this.board.modifiedTiles) {
				if(_.any(this.board.modifiedTiles[modifyKey],
					tile.positionMatch, tile)) {
					tileModifier = this.board.tileModifiers[modifyKey];
					if(this.board.scoreModifiers[modifyKey]) {
						scoreModifiers.push(this.board.scoreModifiers[modifyKey]);
					}
				}
			}
			//travel along +/- directions of axis for existing tiles
			//modify postScore to avoid score modification
			var goingNeg = true, goingPos = true;

			while(goingNeg){
				goingNeg = false;
			}

			while(goingPos) {
				goingPos = false;
			}

			if(tileModifier) {
				runningScore += tileModifier(tile);
			}
			else {
				runningScore += tile.get("points");
			}
		}

		var goingForw = true;
		var goingForwCounter = minaxiscoord + 1;

		tileOnAxis = function(tile) {
			return tile.get("position")[axis] === goingForwCounter;
		};

		while(goingForw) {
			if(goingForwCounter > -1) {
				var goingForwTile = _.find(boardTilesOnAxis, tileOnAxis);
				if(goingForwTile) {
					runningScore += goingForwTile.get("points");
					goingForwCounter++;
					continue;
				}
			}
			goingForw = false;
		}

		for(var j = 0; j < scoreModifiers.length; j++) {
			runningScore = scoreModifiers[j](runningScore);
		}

		return runningScore + postScore;
	},

	getOrientation: function() {
		var axes = this.map(
			function(a) {
				return a.get("position").x;
			});
		if(_.every(axes, function(a){return a==axes[0];})) {
			this.comparator = function(tile) {
				return tile.get("position").y;
			};
			return "vert";
		}

		axes = this.map(
			function(a) {
				return a.get("position").y;
			});
		if(_.every(axes, function(a){return a==axes[0];})) {
			this.comparator = function(tile) {
				return tile.get("position").x;
			};
			return "hori";
		}

		return null;
	}
});

window.EndTurnView = Backbone.View.extend({
	initialize: function(options) {
		this.game = options.game;
		this.$el = $(".endTurn");
	},

	events: {
		"click": "endTurn"
	},

	endTurn: function() {
		this.game.endCurrentTurn();
	}
});