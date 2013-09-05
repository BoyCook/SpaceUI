
function HTMLGenerator() {
	this.contentTypes = {
		'text/x-tiddlywiki': 'TiddlyWiki Text',
		'text/x-markdown': 'Markdown',
		'text/plain': 'Plain Text',
		'text/html': 'HTML',
		'text/css': 'CSS',
		'text/javascript': 'JavaScript'
	};
	this.templates = {
		view: Handlebars.compile($("#tiddler-view-template").html()),
		edit: Handlebars.compile($("#tiddler-edit-template").html())
	};
}

HTMLGenerator.prototype.generateViewTiddler = function(tiddler) {
	return this.templates.view(tiddler);
};

HTMLGenerator.prototype.generateEditTiddler = function(tiddler) {
	return this.templates.edit(tiddler);
	// var container = new HTML('section', undefined, { id: tiddler.id, class: 'tiddler tiddler-edit-mode' });
	// var header = new HTML('section');
	// header.append(new HTML('input', undefined, { type: 'text', value: tiddler.title, class: 'tiddler-title' }));
	
	// var config = new HTML('section', undefined, { class: 'tiddler-edit-config' });
	// config.append(new HTML('input', undefined, { type: 'radio', name: 'privacy', value: 'private' }));
	// config.append( new HTML('i', undefined, { class: 'icon-lock', title: 'Private' }));
	// config.append(new HTML('input', undefined, { type: 'radio', name: 'privacy', value: 'public', checked: 'checked' }));
	// config.append(new HTML('i', undefined, { class: 'icon-unlock', title: 'Public' }));
	// config.append(this.generateTypeOptions(tiddler.type ? tiddler.type : 'application/json'));
	
	// var content = new HTML('section');
	// content.append(new HTML('textarea', tiddler.text, { class: 'tiddler-text'}));	
	// var footer = new HTML('section');
	// footer.append(new HTML('input', undefined, { type: 'text', value: tiddler.tags.toString().replace(/\,/g, ' '), class: 'tiddler-tags' }));

	// container.append(this.generateEditToolbar(tiddler));
	// container.append(header);
	// container.append(config);
	// container.append(content);
	// container.append(footer);
	// return container.asHTML();
};

HTMLGenerator.prototype.generateTiddlersList = function(tiddlers) {
	var list = new HTML('ul');
	for (var i=0,len=tiddlers.length; i < len; i++) {
		list.append(this.generateTiddlerItem(tiddlers[i]));
	}
	return list;
};

HTMLGenerator.prototype.generateTiddlerItem = function(tiddler) {
	var a = new HTML('a', tiddler.title, { href: "#tiddler/" + tiddler.title + "/open" });
	var item = new HTML('li');
	item.append(a);	
	return item;
};

HTMLGenerator.prototype.generateTagsList = function(tags) {
	var list = new HTML('ul');
	for (var i=0,len=tags.length; i < len; i++) {
		list.append(this.generateTagItem(tags[i]));
	}
	return list;
};

HTMLGenerator.prototype.generateTagItem = function(tag) {
	var a = new HTML('a', tag, { href: "#tag/" + tag + "/open" });
	var item = new HTML('li');
	item.append(a);	
	return item;
};

HTMLGenerator.prototype.generateViewToolbar = function(tiddler) {
	var toolbar = new HTML('section', undefined, { class: 'toolbar' });
	var maximize = new HTML('a', undefined, { href: "#maximize/" + tiddler.id, title: 'Maximize' });
	maximize.append(new HTML('i', undefined, { class: 'icon-resize-full'}));		
	var minimize = new HTML('a', undefined, { href: "#minimize/" + tiddler.id, title: 'Minimize', class: 'hidden' });
	minimize.append(new HTML('i', undefined, { class: 'icon-resize-small'}));		
	var edit = new HTML('a', undefined, { href: "#tiddler/" + tiddler.title + "/edit", title: 'Edit tiddler' });
	edit.append(new HTML('i', undefined, { class: 'icon-file-edit' }));	
	var close = new HTML('a', undefined, { href: "#tiddler/" + tiddler.title + "/close", title: 'Close tiddler' });
	close.append(new HTML('i', undefined, { class: 'icon-remove' }));
	toolbar.append(edit);
	toolbar.append(close);
	toolbar.append(maximize);
	toolbar.append(minimize);
	return toolbar;
};

HTMLGenerator.prototype.generateEditToolbar = function(tiddler) {
	var toolbar = new HTML('section', undefined, { class: 'toolbar' });
	var save = new HTML('a', undefined, { href: "#tiddler/" + tiddler.title + "/save", title: 'Save changes' });
	save.append(new HTML('i', undefined, { class: 'icon-ok' }));		
	var cancel = new HTML('a', undefined, { href: "#tiddler/" + tiddler.title + "/canceledit" });
	cancel.append(new HTML('i', undefined, { class: 'icon-reverse-alt', title: 'Cancel changes' }));		
	var maximize = new HTML('a', undefined, { href: "#maximize/" + tiddler.id, title: 'Maximize' });
	maximize.append(new HTML('i', undefined, { class: 'icon-resize-full' }));		
	var minimize = new HTML('a', undefined, { href: "#minimize/" + tiddler.id, title: 'Minimize', class: 'hidden' });
	minimize.append(new HTML('i', undefined, { class: 'icon-resize-small'}));		
	var del = new HTML('a', undefined, { href: "#tiddler/" + tiddler.title + "/delete", title: 'Delete tiddler' });
	del.append(new HTML('i', undefined, { class: 'icon-trash' }));			
	toolbar.append(save);
	toolbar.append(cancel);
	toolbar.append(del);
	toolbar.append(maximize);
	toolbar.append(minimize);
	return toolbar;
};

HTMLGenerator.prototype.generateTypeOptions = function(selected) {
	// TODO: make this more eloquent
	var list = new HTML('select', undefined, { class: 'tiddler-type' });
	var values = {
		'Markdown': { value: 'text/x-markdown' },
		'Plain Text': { value: 'text/plain' },
		'HTML': { value: 'text/html' },
		'CSS': { value: 'text/css' },
		'JavaScript': { value: 'text/javascript' },
		'TiddlyWiki Text': { value: 'text/x-tiddlywiki' },
	};
	var type = this.contentTypes[selected];
	if (values.hasOwnProperty(type)) {
		values[type].selected = 'true';
	} else {
		values['Markdown'].selected = 'true';
	}
	for (var key in values) {
		list.append(new HTML('option', key, values[key]));
	}
	return list;
};

HTMLGenerator.prototype.isCode = function(tiddler) {
	if (tiddler.type === 'application/json' || 
		tiddler.type === 'application/javascript' || 
		tiddler.type === 'text/javascript' || 
		tiddler.type === 'text/css'  || 
		tiddler.type === 'text/html' ) {
		return true;
	} else {
		return false;
	}
};

HTMLGenerator.prototype.isImage = function(tiddler) {
	if (tiddler.type === 'image/png' || 
		tiddler.type === 'image/jpeg' || 
		tiddler.type === 'image/jpg' ) {	
		return true;
	} else {
		return false;
	}
};
