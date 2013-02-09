define(function() {
	var JST = {};

	JST['tile'] = _.template([
			"<div class='tile-letter'><%= letter %></div>",
			"<div class='tile-points'><%= points %></div>"
		].join(''));

	return JST;
});

