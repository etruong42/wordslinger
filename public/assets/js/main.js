

$(function(){
	var app = new wordslinger();
	app.start();

	var tileArray = [
			{letter:"a", points:1, count:9},
			{letter:"b", points:3, count:2},
			{letter:"c", points:3, count:2},
			{letter:"d", points:1, count:5},
			{letter:"e", points:1, count:12},
			{letter:"f", points:4, count:2},
			{letter:"g", points:1, count:5},
			{letter:"h", points:4, count:2},
			{letter:"i", points:1, count:9},
			{letter:"j", points:8, count:1},
			{letter:"k", points:5, count:1},
			{letter:"l", points:1, count:4},
			{letter:"m", points:3, count:2},
			{letter:"n", points:1, count:6},
			{letter:"o", points:1, count:8},
			{letter:"p", points:3, count:2},
			{letter:"q", points:10, count:1},
			{letter:"r", points:1, count:6},
			{letter:"s", points:1, count:4},
			{letter:"t", points:1, count:6},
			{letter:"u", points:1, count:4},
			{letter:"v", points:4, count:2},
			{letter:"w", points:4, count:2},
			{letter:"x", points:8, count:1},
			{letter:"y", points:4, count:2},
			{letter:"z", points:10, count:1},
			{letter:"", points:0, count:2}
		];

		var createPlayerPanel = function(hand) {
			return new PlayerPanelView({hand: hand});
		};

		var h = new Hand();
		//h.setVisibility(true);
		//h.handView.$el = $('#hand1');

		var h2 = new Hand();
		//h2.handView.$el = $('#hand2');

		$("div.players")
			.append(createPlayerPanel(h).$el)
			.append(createPlayerPanel(h2).$el);

		var gb = new Grabbag();
		gb.initTiles(tileArray);
		var b = new Board({hands: [h, h2], grabbag: gb});
		var bv = new BoardView({model:b, height: 15, width: 15, $el : $("#board1")});
		var ws = new WordslingerGame({board: b, grabbag: gb});

		ws.startGame();
});