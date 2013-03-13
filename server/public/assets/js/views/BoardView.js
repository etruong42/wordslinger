define([
	'models/TileSlot'
	], function(TileSlot) {
	var BoardView = Backbone.View.extend({
		tagName: 'div',
		className: 'board',

		render: function() {
			this.$el.width(this.width * 38);
			this.$el.height(this.height * 38);
			return this;
		},

		generateRow: function(length, rowIndex) {
			//TODO: use DOM fragments
			for(var i = 0; i < length; i++) {
				var tileSlot = new TileSlot({x:i, y:rowIndex, board:this.model});
				this.$el.append(tileSlot.tileSlotView.el);
				tileSlot.tileSlotView.$el.droppable({
					accept: ".tile",
					tolerance: "pointer",
					addClasses: false
				});
				if(!this.model.tileslots[i][rowIndex]) {
					this.model.tileslots[i] = [];
				}
				this.model.tileslots[i][rowIndex] = tileSlot;
			}
		},

		initialize: function(options) {
			this.width = options.width;
			this.height = options.height;
			for(var i = 0; i < this.height; i++) {
				this.generateRow(this.width, i);
			}
		}
	});

	return BoardView;
});