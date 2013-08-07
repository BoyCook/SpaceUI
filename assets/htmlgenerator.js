
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
	} else if (tiddler.type === 'image/png' || tiddler.type === 'image/jpeg' || tiddler.type === 'image/jpg' ) {	
		var image = new HTML('img', undefined, {src: tiddler.uri});
		content.append(image);
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
	var visibility = new HTML('section', undefined, { class: 'tiddler-edit-visibility' });
	var privateRad = new HTML('input', undefined, { type: 'radio', name: 'privacy', value: 'private' });	
	var labelPrivate = new HTML('label', 'private');	
	var publicRad = new HTML('input', undefined, { type: 'radio', name: 'privacy', value: 'public', checked: 'checked' });
	var labelPublic = new HTML('label', 'public');	
	header.append(headerText);
	visibility.append(privateRad);
	visibility.append(labelPrivate);
	visibility.append(publicRad);
	visibility.append(labelPublic);
	
	var content = new HTML('section');
	var contentText = new HTML('textarea', tiddler.text, { class: 'tiddler-text'});
	content.append(contentText);	
	var footer = new HTML('section');
	var footerText = new HTML('input', undefined, { type: 'text', value: tiddler.tags, class: 'tiddler-tags' });
	footer.append(footerText);

	container.append(this.generateEditToolbar(tiddler));
	container.append(header);
	container.append(visibility);
	container.append(content);
	container.append(footer);
	return container.asHTML();
};

HTMLGenerator.prototype.generateTiddlersList = function(tiddlers) {
	var list = new HTML('ul');
	for (var i=0,len=tiddlers.length; i < len; i++) {
		list.append(this.generateTiddlerItem(tiddlers[i]));
	}
	return list;
};

HTMLGenerator.prototype.generateTiddlerItem = function(tiddler) {
	var onclick = "app.openTiddler('" + tiddler.title + "\')";
	var a = new HTML('a', tiddler.title, { href: '#' + tiddler.id, onclick: onclick });
	var item = new HTML('li');
	item.append(a);	
	return item;
};

HTMLGenerator.prototype.generateViewToolbar = function(tiddler) {
	var editClick = "app.editTiddler('" + tiddler.title + "\')";
	var closeClick = "app.closeTiddler('" + tiddler.id + "\')";
	var toolbar = new HTML('section', undefined, { class: 'toolbar' });
	var editButton = new HTML('a', undefined, { onclick: editClick, title: 'Edit tiddler' });
	var editIcon = new HTML('i', undefined, { class: 'icon-file-edit' });
	editButton.append(editIcon);	
	var closeButton = new HTML('a', undefined, { onclick: closeClick, title: 'Close tiddler' });
	var closeIcon = new HTML('i', undefined, { class: 'icon-remove' });
	closeButton.append(closeIcon);
	toolbar.append(editButton);
	toolbar.append(closeButton);
	return toolbar;
};

HTMLGenerator.prototype.generateEditToolbar = function(tiddler) {
	var saveClick = "app.saveTiddler('" + tiddler.title + "\')";
	var cancelClick = "app.cancelEditTiddler('" + tiddler.title + "\')";
	var deleteClick = "app.deleteTiddler('" + tiddler.title + "\')";
	var toolbar = new HTML('section', undefined, { class: 'toolbar' });
	var saveButton = new HTML('a', undefined, { onclick: saveClick, title: 'Save changes' });
	var saveIcon = new HTML('i', undefined, { class: 'icon-ok' });
	saveButton.append(saveIcon);		
	var cancelButton = new HTML('a', undefined, { onclick: cancelClick });
	var cancelIcon = new HTML('i', undefined, { class: 'icon-reverse-alt', title: 'Cancel changes' });
	cancelButton.append(cancelIcon);		
	var deleteButton = new HTML('a', undefined, { onclick: deleteClick, title: 'Delete tiddler' });
	var deleteIcon = new HTML('i', undefined, { class: 'icon-trash' });
	deleteButton.append(deleteIcon);			
	toolbar.append(saveButton);
	toolbar.append(cancelButton);
	toolbar.append(deleteButton);
	return toolbar;
};
