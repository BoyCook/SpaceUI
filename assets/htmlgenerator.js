
function HTMLGenerator() {
}

HTMLGenerator.prototype.generateViewTiddler = function(tiddler) {
	var container = new HTML('section', undefined, { id: tiddler.id, class: 'tiddler' });
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

	container.append(this.generateViewToolbar(tiddler));
	container.append(header);
	container.append(content);
	return container.asHTML();
};

HTMLGenerator.prototype.generateEditTiddler = function(tiddler) {
	var container = new HTML('section', undefined, { id: tiddler.id, class: 'tiddler tiddler-edit-mode' });
	var header = new HTML('section');
	var headerText = new HTML('input', undefined, { type: 'text', value: tiddler.title, class: 'tiddler-title' });
	header.append(headerText);
	var content = new HTML('section');
	var contentText = new HTML('textarea', tiddler.text, { class: 'tiddler-text'});
	content.append(contentText);	
	var footer = new HTML('section');
	var footerText = new HTML('input', undefined, { type: 'text', value: tiddler.tags, class: 'tiddler-tags' });
	footer.append(footerText);

	container.append(this.generateEditToolbar(tiddler));
	container.append(header);
	container.append(content);
	container.append(footer);
	return container.asHTML();
};

HTMLGenerator.prototype.generateTiddlersList = function(tiddlers) {
	var list = new HTML('ul');
	for (var i=0,len=tiddlers.length; i<len; i++) {
		list.append(this.generateTiddlerItem(tiddlers[i]));
	}
	return list.asHTML();
};

HTMLGenerator.prototype.generateTiddlerItem = function(tiddler) {
	var onclick = "app.openTiddler('" + tiddler.title + "\')";
	var a = new HTML('a', tiddler.title, { href: '#' + this.getId(tiddler), onclick: onclick });
	var item = new HTML('li');
	item.append(a);	
	return item;
};

HTMLGenerator.prototype.generateViewToolbar = function(tiddler) {
	var editClick = "app.editTiddler('" + tiddler.title + "\')";
	var closeClick = "app.closeTiddler('" + tiddler.id + "\')";
	var toolbar = new HTML('section', undefined, { class: 'toolbar' });
	var editButton = new HTML('button', 'Edit', { onclick: editClick });
	var closeButton = new HTML('button', 'X', { onclick: closeClick });
	toolbar.append(editButton);
	toolbar.append(closeButton);
	return toolbar;
};

HTMLGenerator.prototype.generateEditToolbar = function(tiddler) {
	var saveClick = "app.saveTiddler('" + tiddler.title + "\')";
	var cancelClick = "app.cancelEditTiddler('" + tiddler.title + "\')";
	var deleteClick = "app.deleteTiddler('" + tiddler.title + "\')";
	var toolbar = new HTML('section', undefined, { class: 'toolbar' });
	var saveButton = new HTML('button', 'Save', { onclick: saveClick });
	var cancelButton = new HTML('button', 'Cancel', { onclick: cancelClick });
	var deleteButton = new HTML('button', 'Delete', { onclick: deleteClick });
	toolbar.append(saveButton);
	toolbar.append(cancelButton);
	toolbar.append(deleteButton);
	return toolbar;
};

HTMLGenerator.prototype.getId = function(tiddler) {
    return 'tiddler' + tiddler.title.replace(/ /g,"_").replace(/\./g,"_");
};
