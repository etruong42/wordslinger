(function($){
	window.Move = Backbone.Collection.extend({
		orientation = 0, 
		// 1 is vertical, 2 is horizontal, -1 is invalid, 0 is default

		//on tileAdded: 
			//set orientation

		//bind to tileSelected
			//set selectedTile

		selectedTile,

		alreadyOnBoardTiles = [];

		lastPositionAdded,

		lastTileAdded,

		isLegal() {
			if(!orientation) {
				//get x of first one
				//check if any has different x

				//repeat for y
				//set orientation

				return false; //if neither
			}
			if(orientation === 1) { //should be vertical
				//get x of one
				//check for any not on same x
			}
			//should be horizontal
			//get y of one
			//check for any not on same y
		}
	});
})(jQuery);