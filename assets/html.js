
function HTML() {
}

HTML.prototype.generateTiddler = function(tiddler) {
	var id = 'tiddler' + tiddler.title.replace(/ /g,"_")
	return 	"<section class='tiddler' id='" + id + "'><section><p class='tiddler-title'>" + tiddler.title + "</p> <p class='tiddler-modified'>" + tiddler.modified + "</p></section>" +
			"<article>" + (tiddler.render ? tiddler.render : tiddler.text) + "</article></section>"	
}

HTML.prototype.generateTiddlerList = function(tiddler) {
	var onclick = "app.loadTiddler('" + tiddler.title + "\')";
	return "<article>" + this.a({href: '#', title: tiddler.title, onclick: onclick}) + "</article>"
}

HTML.prototype.a = function(a) {
	return "<a href=\"" + a.href + "\" onclick=\"" + a.onclick + "\">" + a.title + "</a>"
}
