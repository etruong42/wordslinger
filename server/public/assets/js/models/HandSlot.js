define([
	'views/HandSlotView'
	], function(HandSlotView) {
	var HandSlot = Backbone.Model.extend({
		initialize: function(options) {
			this.handSlotView = new HandSlotView({hand: options.hand});
		}
	});

	return HandSlot;
});