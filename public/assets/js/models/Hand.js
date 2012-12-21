window.Hand = Backbone.Collection.extend({
	model: Tile,

	initialize: function() {
		this.handView = new HandView({collection: this});
		this.selectedTile = null;
		this.on("tile:select", this.selectTile, this);
	},

	grabTiles: function(grabbag, grabNum, outTiles) {
		if(outTiles) {
			this.remove(outTiles);
			grabbag.add(outTiles);
		}
		_(grabNum).times(function(a){this.grabTile(grabbag);}, this);
	},

	getSelectedTile: function() {
		return this.selectedTile;
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
	}
});

window.EndTurnView = Backbone.View.extend({
	initialize: function(options) {
		this.game = options.game;
	},

	events: {
		"click": "endTurn"
	},

	endTurn: function() {
		this.game.endCurrentTurn();
	}
});

window.HandView = Backbone.View.extend({
	tagName: 'div',
	className: 'hand',

	initialize: function(options) {
		this.collection = options.collection;
		this.$el.droppable({
			accept: ".selected",
			tolerance: "pointer",
			drop: function(event, ui) {
				ui.draggable.attr("style", null);
			}
		});
	},

	events: {
		
	},

	renderTile: function(tile) {
		this.$el.append(tile.tileView.$el);
		tile.tileView.$el.draggable({
			revert: "invalid",
			appendTo: ".tileSlot",
			addClasses: false
		});
	},

	render: function(){
		var that = this;
		this.$el.empty();
		_(this.collection.models.length).times(function(a){
			var newHandSlot = new HandSlot({hand: that.collection});
			that.$el.append(newHandSlot.handSlotView.$el);
			newHandSlot.handSlotView.$el.append(that.collection.models[a].tileView.$el);
		});
	},

	getFirstEmpty: function() {
		return _.find(
			_.map(this.$el.find(".handSlot"),
			function(a){return $(a);}),
				function(a){return a.is(":empty");});
	}
});