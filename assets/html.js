
function HTML() {
}

HTML.prototype.generateTiddler = function(tiddler) {
	var id = 'tiddler' + tiddler.title.replace(/ /g,"_")
	return 	"<section class='tiddler' id='" + id + "'><section><h3 class='tiddler-title'>" + tiddler.title + "</h3> <p class='tiddler-modified'>" + tiddler.modified + "</p></section>" +
			"<article>" + (tiddler.render ? tiddler.render : tiddler.text) + "</article></section>"	
}

HTML.prototype.generateTiddlerList = function(tiddler) {
	var onclick = "app.getTiddler('" + tiddler.title + "\')";
	return "<article>" + this.a({href: '#', title: tiddler.title, onclick: onclick}) + "</article>"
}

HTML.prototype.a = function(a) {
	var onclick = a.onclick ? " onclick=\"" + a.onclick + "\"" : "";
	return "<a href=\"" + a.href + "\" " + onclick + ">" + a.title + "</a>"
}
