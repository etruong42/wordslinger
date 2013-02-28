define(function() {
	var HandSlotView = Backbone.View.extend({
		tagName: "div",
		className: "handSlot",

		events: {
			"click": "placeTile"
		},

		placeTile: function(tile) {
			var selected = this.hand.selectedTile;
			if(selected) {
				this.$el.append(selected.tileView.$el);
				this.hand.trigger("tile:handslotmove", selected);
			}
		},

		initialize: function(options) {
			this.hand = options.hand;
			var that = this;
			var dropEvent = function(evt, ui) {
				if(!$(this).is(":empty")) {
					ui.draggable.animate(
						{left: 0, top:0},
						500
					);
					return;
				}
				that.hand.selectedTile.tileView.$el
					.appendTo(this)
					.attr("style", null);
				that.hand.trigger("tile:handslotmove", that.hand.selectedTile);
			};
			this.$el.droppable({
					accept: ".tile",
					tolerance: "pointer",
					addClasses: false,
					drop: dropEvent
				});
		}
	});
	return HandSlotView;
});