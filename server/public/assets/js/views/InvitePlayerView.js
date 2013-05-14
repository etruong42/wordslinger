define([
	], function() {
	var InvitePlayerView = Backbone.View.extend({
		tagName: 'div',
		className: 'invite-player',

		initialize: function() {
			this.$player = $("<input type='text class='invite-player' />");
			this.$invite = $("<input type='button' class='invite-player btn' />");
			this.$invite.click($.proxy(this.invite, this));
			this.$el.append($player);
			this.$el.append($invite);
		},

		invite: function() {
			this.trigger("player:invite", this.$player.val());
		}
	});

	return InvitePlayerView;
});