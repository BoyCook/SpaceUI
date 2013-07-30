
function HTMLGenerator() {
}

HTMLGenerator.prototype.generateViewTiddler = function(tiddler) {
	var container = new HTML('section', undefined, { id: this.getId(tiddler), class: 'tiddler' });
	var header = new HTML('section');
	var h3 = new HTML('h3', tiddler.title , { class: 'tiddler-title' });
	var p = new HTML('p', tiddler.modified , { class: 'tiddler-modified' });
	header.append(h3);
	header.append(p);

	var text = (tiddler.render ? tiddler.render : tiddler.text);
	var content = new HTML('article');

	if (tiddler.type === 'application/javascript' || tiddler.type === 'application/json' || tiddler.type === 'text/css' ) {
		var code = new HTML('pre', text);
		content.append(code);
	} else {
		content.value = text;
	}

	container.append(header);
	container.append(content);
	return container.asHTML();
}

HTMLGenerator.prototype.generateEditTiddler = function(tiddler) {
	var container = new HTML('section', undefined, { id: this.getId(tiddler), class: 'tiddler' });
	var header = new HTML('section');
	var headerText = new HTML('input', undefined, { type: 'text', value: tiddler.title });
	header.append(headerText);
	var content = new HTML('section');
	var contentText = new HTML('textarea', tiddler.text);
	content.append(contentText);	
	var footer = new HTML('section');
	var footerText = new HTML('input', undefined, { type: 'text', value: tiddler.tags });
	footer.append(footerText);

	container.append(header);
	container.append(content);
	container.append(footer);
	return container.asHTML();
}

HTMLGenerator.prototype.generateTiddlerList = function(tiddler) {
	var onclick = "app.openTiddler('" + tiddler.title + "\')";
	var a = new HTML('a', tiddler.title, { href: '#', onclick: onclick });
	var article = new HTML('article');
	article.append(a);
	return article.asHTML();
}

//TODO: consider moving this out and make 'id' a tiddler property
HTMLGenerator.prototype.getId = function(tiddler) {
	return 'tiddler' + tiddler.title.replace(/ /g,"_").replace(/\./g,"_");
}
