(function($) {
	window.Hand = Backbone.Collection.extend({
		model: Tile
	});

	window.HandView = Backbone.View.extend({
		tagName: 'div',
		className: 'hand',

		//bind click of tiles in collection
			//to toggle selected
			//trigger tileSelected (tile)
		initialize: function() {
			this.template = _.template($('#hand-template').html());
		},

		render: function(){
			var data = {
				tiles: this.collection.models
			};
			console.ethan = this.template(data);
			$(this.el).html(this.template(data));
			return this;
		}
	});
})(jQuery);