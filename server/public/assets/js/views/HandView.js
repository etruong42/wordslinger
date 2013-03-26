define([
	'models/HandSlot'
	], function(HandSlot) {
	var HandView = Backbone.View.extend({
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
			return this;
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
	return HandView;
});