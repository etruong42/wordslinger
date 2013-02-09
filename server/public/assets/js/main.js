require.config({
	paths: {
		"TileView": "views/TileView"
	}
});

require(['app'], function(app){
	app.start();
});