define([
	'models/WordslingerGame',
	'models/Board',
	'views/BoardView',
	'models/Hand',
	'views/PlayerPanelView',
	'models/Grabbag',
	'views/PlayerLoginView',
	'views/PlayerSignupView',
	'WordslingerRouter'
	],function(WordslingerGame, Board, BoardView, Hand, PlayerPanelView, Grabbag,
		PlayerLoginView, PlayerSignupView, WordslingerRouter){
	return {
		start: function(){
			var tileArray = [
				{letter:"A", points:1, count:9},
				{letter:"B", points:3, count:2},
				{letter:"C", points:3, count:2},
				{letter:"D", points:1, count:5},
				{letter:"E", points:1, count:12},
				{letter:"F", points:4, count:2},
				{letter:"G", points:1, count:5},
				{letter:"H", points:4, count:2},
				{letter:"I", points:1, count:9},
				{letter:"J", points:8, count:1},
				{letter:"K", points:5, count:1},
				{letter:"L", points:1, count:4},
				{letter:"M", points:3, count:2},
				{letter:"N", points:1, count:6},
				{letter:"O", points:1, count:8},
				{letter:"P", points:3, count:2},
				{letter:"Q", points:10, count:1},
				{letter:"R", points:1, count:6},
				{letter:"S", points:1, count:4},
				{letter:"T", points:1, count:6},
				{letter:"U", points:1, count:4},
				{letter:"V", points:4, count:2},
				{letter:"W", points:4, count:2},
				{letter:"X", points:8, count:1},
				{letter:"Y", points:4, count:2},
				{letter:"Z", points:10, count:1},
				{letter:"", points:0, count:2}
			];

			window.r = new WordslingerRouter();
			Backbone.history.start();

			var login = new PlayerLoginView();
			var signup = new PlayerSignupView();
			$('#login').append(login.render().$el);
			$('#login').append(signup.render().$el);

			var createPlayerPanel = function(hand) {
				return new PlayerPanelView({hand: hand});
			};

			var h = new Hand();

			var h2 = new Hand();

			var $player = $("div.players")
				.append(createPlayerPanel(h).$el)
				.append(createPlayerPanel(h2).$el);
			$player.hide();

			var gb = new Grabbag();
			gb.initTiles(tileArray);
			var b = new Board({hands: [h, h2], grabbag: gb});
			var $board = $("#board1");
			$board.hide();
			window.board = b;
			var bv = new BoardView({model:b, height: 15, width: 15, $el : $board});
			var ws = new WordslingerGame();
			ws.board = b;
			ws.grabbag = gb;

			ws.startGame();
		}
	};
});