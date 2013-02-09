define(function() {
	var Move = Backbone.Collection.extend({
		events: {
			"add": "logChange",
			"remove": "logChange"
		},

		logChange: function() {
			//console.log(this.models.map(function(a) {return a.toJSON();}));
			//console.log(this.models.map(function(a) {return a.toJSON().letter;}));
		},

		initialize: function(options){
			this.on("add", this.logChange, this);
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

			var firstTile = this.at(0);

			if(!firstTile) {
				return 0; //0 points for no tiles
			}

			var minaxiscoord = firstTile.get("position")[axis];
			var antiaxiscoord = firstTile.get("position")[antiaxis];

			var goingBack = true;

			var runningScore = 0;
			var scoreModifiers = [];
			var postScore = 0;
			var baseCoord = null;

			var boardTilesOnAxis = this.board.getTilesOnAxis(antiaxis, antiaxiscoord);
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
			var tile, loopCounter;

			for(loopCounter = 0; loopCounter < this.length; loopCounter++) {
				tile = this.at(loopCounter);
				var currentScoreModifier;
				if(!baseCoord) {
					baseCoord = tile.get("position")[axis];
				}
				else if(baseCoord !== tile.get("position")[axis] - 1) {
					//check board already have tile(s)
					goingBackCounter = 1 + baseCoord; //hijacking goingBackCounter for tileOnAxis function
					while(goingBackCounter < tile.get("position")[axis]) {
						//iterate from baseCoord to tile.get("position")[axis] - 1
						var goingBetweenTile = _.find(boardTilesOnAxis, tileOnAxis);
						if(goingBetweenTile) {
							runningScore += goingBetweenTile.get("points");
							goingBackCounter++;
						}
						else {
							return null;
						}
					}
				}
				baseCoord = tile.get("position")[axis];
				var tileModifier = null;
				for(var modifyKey in this.board.modifiedTiles) {
					if(_.any(this.board.modifiedTiles[modifyKey],
						tile.positionMatch, tile)) {
						tileModifier = this.board.tileModifiers[modifyKey];
						if(this.board.scoreModifiers[modifyKey]) {
							currentScoreModifier = this.board.scoreModifiers[modifyKey];
							scoreModifiers.push(this.board.scoreModifiers[modifyKey]);
						}
					}
				}
				//travel along +/- directions of antiaxis for existing tiles
				//modify postScore to avoid score modification
				var goingNeg = true,
					goingPos = true,
					tmpPos,
					curAntiaxisCoord,
					goingTile,
					counted = false,
					goingScore = 0;

				curAntiaxisCoord = antiaxiscoord - 1;
				while(goingNeg){
					if(curAntiaxisCoord > -1) {
						tmpPos = {};
						tmpPos[antiaxis] = curAntiaxisCoord;
						tmpPos[axis] = baseCoord;
						goingTile = this.board.getTileAt(tmpPos);
						if(goingTile) {
							if(!counted) {
								if(tileModifier) {
									goingScore += tileModifier(tile);
								}
								else if(this.length > 1) {
									goingScore += tile.get("points");
								}
								counted = true;
							}
							goingScore += goingTile.get("points");
							curAntiaxisCoord--;
						}
						else {
							goingNeg = false;
						}
					}
				}

				curAntiaxisCoord = antiaxiscoord + 1;
				while(goingPos) {
					if(curAntiaxisCoord <= 15) { //TODO: get board max axis
						tmpPos = {};
						tmpPos[antiaxis] = curAntiaxisCoord;
						tmpPos[axis] = baseCoord;
						goingTile = this.board.getTileAt(tmpPos);
						if(goingTile){
							if(!counted) {
								if(tileModifier) {
									goingScore += tileModifier(tile);
								}
								else if(this.length > 1) {
									goingScore += tile.get("points");
								}
								counted = true;
							}
							goingScore += goingTile.get("points");
							curAntiaxisCoord++;
						}
						else {
							goingPos = false;
						}
					}
				}

				//done with going logic
				if(currentScoreModifier) {
					postScore += currentScoreModifier(goingScore);
				} else {
					postScore += goingScore;
				}

				if(tileModifier) {
					runningScore += tileModifier(tile);
				} else {
					runningScore += tile.get("points");
				}
			}

			var goingForw = true;
			var goingForwCounter = tile.get("position")[axis] + 1;

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

	return Move;
});