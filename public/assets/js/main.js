require.config({
	paths: {
		jquery: 'vendor/jquery-1.8.2',
		underscore: 'vendor/underscore',
		backbone: 'vendor/backbone'
	}

});

require(['app'], function(app){
	app.start();
});