define([
	'models/Tile',
	'views/HandView',
	'views/HideHandView'
	], function(Tile, HandView, HideHandView) {
	var Hand = Backbone.Collection.extend({
		model: Tile,

		initialize: function() {
			this.handView = new HandView({collection: this});
			this.visibilityControl = new HideHandView({hand: this});
			this.visible = false;
			this.handView.$el.hide();
			this.selectedTile = null;
		},

		setVisibility: function(bool) {
			this.visible = bool;
			this.visibilityControl.setHandVisibility(this, bool);
		},

		grabTiles: function(grabbag, grabNum, outTiles) {
			if(outTiles) {
				this.remove(outTiles);
				grabbag.add(outTiles);
			}
			_(grabNum).times(function(a){this.grabTile(grabbag);}, this);
			return this;
		},

		selectTile: function(tile) {
			if(this.selectedTile) {
				this.selectedTile.unselect();
			}
			this.selectedTile = tile;
			tile.select();
		},

		grabTile: function(grabbag) {
			this.push(grabbag.pop());
		},

		endTurn: function(moveTiles) {
			_.each(moveTiles, function(a) {a.unselect();});
			_.each(moveTiles, function(a) {a.setDraggability(false);});
			this.remove(moveTiles);
			return this;
		},

		updateCurrentMoveScore: function(movescore) {
			//console.log("updating: " + movescore);
			if(movescore) {
				
				var movescoreEl = this.handView.getMovescoreEl();
				movescoreEl.show();
				movescoreEl.text("+" + movescore);
			}
			else {
				$(this.handView.getMovescoreEl()).hide();
			}
			return this;
		}
	});
	return Hand;
});