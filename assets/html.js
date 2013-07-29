
function HTML() {

}

HTML.prototype.generateTiddler = function(tiddler) {
	return "<article>" + tiddler.text + "</article>"
}

HTML.prototype.generateTiddlerList = function(tiddler) {
	var onclick = "app.loadTiddler('" + tiddler.title + "\')";
	return "<article>" + this.a({href: '#', title: tiddler.title, onclick: onclick}) + "</article>"
}

HTML.prototype.a = function(a) {
	return "<a href=\"" + a.href + "\" onclick=\"" + a.onclick + "\">" + a.title + "</a>"
}
