window.Hand = Backbone.Collection.extend({
	model: Tile,

	initialize: function() {
		this.handView = new HandView({collection: this});
		this.selectedTile = null;
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

	styleTile: function(tile) {
		tile.tileView.$el
			.draggable({
				revert: "invalid",
				appendTo: ".tileSlot",
				addClasses: false
			});
		tile.styled = true;
		return tile;
	},

	render: function(){
		var that = this;
		this.$el.empty();
		//TODO: use DOM fragments
		_(this.collection.models.length).times(function(a){
			var newHandSlot = new HandSlot({hand: that.collection});
			that.$el.append(newHandSlot.handSlotView.$el);
			newHandSlot.handSlotView.$el.append(that.styleTile(that.collection.models[a]).tileView.$el);
			that.collection.models[a].tileView.delegateEvents();
		});
	},

	getFirstEmpty: function() {
		return _.find(
			_.map(this.$el.find(".handSlot"),
			function(a){return $(a);}),
				function(a){return a.is(":empty");});
	}
});