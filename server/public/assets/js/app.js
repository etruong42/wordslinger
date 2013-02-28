define([
	'models/WordslingerGame',
	'models/Board',
	'views/BoardView',
	'models/Hand',
	'views/PlayerPanelView',
	'models/Grabbag',
	'WordslingerRouter'
	],function(WordslingerGame, Board, BoardView, Hand, PlayerPanelView, Grabbag,
		WordslingerRouter){
	return {
		start: function() {
			var r = new WordslingerRouter();
			Backbone.history.start();
		}
	};
});