define([
	'models/Tile'
	],function(Tile) {
	var Grabbag = Backbone.Collection.extend({
		model: Tile,

		initialize: function(options) {
			this.shuffle();
			//shuffle tiles
		},

		initTiles: function(tileObjArr) {
			this.add(_.shuffle(_.flatten(_.map(tileObjArr, this.getTiles))));
		},

		getTiles: function(tileObj) {
			var arr = [];
			_(tileObj.count).times(
				function(a) {
					arr.push(new Tile({letter: tileObj.letter, points: tileObj.points}));
				}
			);
			return arr;
		}
	});
	return Grabbag;
});