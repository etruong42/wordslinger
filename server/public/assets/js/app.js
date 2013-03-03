define([
	'WordslingerRouter'
	],function(WordslingerRouter){
	return {
		start: function() {
			var r = new WordslingerRouter();
			Backbone.history.start();
		}
	};
});