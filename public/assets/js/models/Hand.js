window.Hand = Backbone.Collection.extend({
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
		console.log("updating: " + movescore);
		if(movescore) {
			var movescoreEl = $(this.handView.getMovescoreEl());
			movescoreEl.html("+" + movescore);
			movescoreEl.show();
		}
		else {
			$(this.handView.getMovescoreEl()).hide();
		}
	}
});

window.HideHandView = Backbone.View.extend({
	tagName: "input",
	className: "showHideHand handhelp",
	events: {
		"click" : "toggleVisibility"
	},

	initialize: function(options) {
		this.hand = options.hand;
		this.$el.attr("type", "button");
		this.setHandVisibility(this.hand, this.hand.visible);
	},

	toggleVisibility: function() {
		var hand = this.$el.parent().find(".hand");
		this.hand.visible = !this.hand.visible;
		this.setHandVisibility(this.hand, this.hand.visible);
	},

	setHandVisibility: function(hand, visibility) {
		if(visibility) {
			hand.handView.$el.show();
			this.$el.attr("value", "hide");
		}
		else {
			hand.handView.$el.hide();
			this.$el.attr("value", "show");
		}
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
			newHandSlot.handSlotView.$el
				.append(that.styleTile(that.collection.models[a]).tileView.$el);
			that.collection.models[a].tileView.delegateEvents();
		});
	},

	getFirstEmpty: function() {
		return _.find(
			_.map(this.$el.find(".handSlot"),
			function(a){return $(a);}),
				function(a){return a.is(":empty");});
	},

	getMovescoreEl: function() {
		return $(this.$el.parent()).find(".movescore");
	}
});

window.PlayerPanelView = Backbone.View.extend({
	tagName: "div",
	className: "playerPanel",

	initialize: function(options) {
		//TODO: use DOM fragments here first
		this.$el.append(options.hand.handView.$el);
		var button = options.hand.visibilityControl;
		this.$el.append(button.$el);
		this.$el.append("<span class='handscore handhelp'>0</span>");
		this.$el.append("<span class='movescore handhelp' style='display:none'>0</span>");
	}
});