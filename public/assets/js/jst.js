window.JST = {};

window.JST['tile'] = _.template([
		"<div class='tile-letter'><%= letter %></div>",
		"<div class='tile-points'><%= points %></div>",
	].join(''));