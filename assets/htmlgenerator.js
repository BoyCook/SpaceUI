
function HTMLGenerator() {
	this.contentTypes = {
		'application/json': 'Default',
		'text/x-markdoxwn': 'Markdown',
		'text/plain': 'Plain Text',
		'text/html': 'HTML',
		'text/css': 'CSS',
		'text/javascript': 'JavaScript'
	};
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
	header.append(new HTML('input', undefined, { type: 'text', value: tiddler.title, class: 'tiddler-title' }));
	
	var config = new HTML('section', undefined, { class: 'tiddler-edit-config' });
	config.append(new HTML('input', undefined, { type: 'radio', name: 'privacy', value: 'private' }));
	config.append( new HTML('label', 'private'));
	config.append(new HTML('input', undefined, { type: 'radio', name: 'privacy', value: 'public', checked: 'checked' }));
	config.append(new HTML('label', 'public'));
	config.append(this.generateTypeOptions(tiddler.type ? tiddler.type : 'application/json'));
	
	var content = new HTML('section');
	content.append(new HTML('textarea', tiddler.text, { class: 'tiddler-text'}));	
	var footer = new HTML('section');
	footer.append(new HTML('input', undefined, { type: 'text', value: tiddler.tags.toString().replace(/\,/g, ' '), class: 'tiddler-tags' }));

	container.append(this.generateEditToolbar(tiddler));
	container.append(header);
	container.append(config);
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

HTMLGenerator.prototype.generateTypeOptions = function(selected) {
	var list = new HTML('select', undefined, { class: 'tiddler-type' });
	var values = {
		'Default': { value: 'application/json' },
		'Markdown': { value: 'text/x-markdown' },
		'Plain Text': { value: 'text/plain' },
		'HTML': { value: 'text/html' },
		'CSS': { value: 'text/css' },
		'JavaScript': { value: 'text/javascript' }
	};
	var type = this.contentTypes[selected];
	if (values.hasOwnProperty(type)) {
		values[type].selected = 'true';
	}
	for (var key in values) {
		list.append(new HTML('option', key, values[key]));
	}
	return list;
};
