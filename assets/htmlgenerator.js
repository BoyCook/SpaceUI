
function HTMLGenerator() {
}

HTMLGenerator.prototype.generateTiddler = function(tiddler) {
	var id = 'tiddler' + tiddler.title.replace(/ /g,"_")

	var container = new HTML('section', undefined, { id: id, class: 'tiddler' });
	var header = new HTML('section');
	var h3 = new HTML('h3', tiddler.title , { class: 'tiddler-title' });
	var p = new HTML('p', tiddler.modified , { class: 'tiddler-modified' });
	header.append(h3);
	header.append(p);

	var text = (tiddler.render ? tiddler.render : tiddler.text);
	var content = new HTML('article');

	if (tiddler.type === 'application/json' || tiddler.type === 'text/css' ) {
		var code = new HTML('code', text);
		content.append(code);
	} else {
		content.value = text;
	}

	container.append(header);
	container.append(content);
	return container.render();
}

HTMLGenerator.prototype.generateTiddlerList = function(tiddler) {
	var onclick = "app.getTiddler('" + tiddler.title + "\')";
	var a = new HTML('a', tiddler.title, { href: '#', onclick: onclick });
	var article = new HTML('article');
	article.append(a);
	return article.render();
}
