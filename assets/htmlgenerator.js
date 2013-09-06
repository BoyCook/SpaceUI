
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
	this._registerHandlers();
}

HTMLGenerator.prototype.generateViewTiddler = function(tiddler) {
	return this.templates.view(tiddler);
};

HTMLGenerator.prototype.generateEditTiddler = function(tiddler) {
	return this.templates.edit(tiddler);
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

HTMLGenerator.prototype._registerHandlers = function() {
	var context = this;
	Handlebars.registerHelper('tiddlertags', function(tags) {
	  return tags.toString().replace(/\,/g, ' ');
	});	
	Handlebars.registerHelper('tiddlertype', function(type, option) {
 		if (type == option) {
 			return "selected=selected"
 		} else {
 			return "";
 		}
	});		
	Handlebars.registerHelper('tiddlertext', function(tiddler) {
		var text = (tiddler.render ? tiddler.render : tiddler.text);
		if (context.isCode(tiddler)) {
			return '<pre>' + text + '<pre/>';
		} else if (context.isImage(tiddler)) {	
			return '<img src="' + tiddler.uri + '" />';
		} else {
			return text;
		}
	});			
};
