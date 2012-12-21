window.Move = Backbone.Collection.extend({

	initialize: function(options){
		this.comparator = function(tile) {
			var orientation = this.getOrientation();
			//calculate orientation multiple times =(
		};
	},

	addTile: function(tile) {
		this.removeTile(tile);
		this.push(tile);
	},

	removeTile: function(tile) {
		this.remove(
			this.filter(
				function(a){
					return a.cid === tile.cid;
				}));
	},

	getTotalScore: function() {
		var orientation = this.getOrientation();
		sortY = function(tile) {

		};
		if(!orientation){
			return null;
		}
	},

	getOrientation: function() {
		var axes = this.map(
			function(a) {
				return a.get("position").x;
			});
		if(_.every(axes, function(a){return a==axes[0];})) {
			return "vert";
		}

		axes = this.map(
			function(a) {
				return a.get("position").y;
			});
		if(_.every(axes, function(a){return a==axes[0];})) {
			return "hori";
		}

		return null;
	}
});
