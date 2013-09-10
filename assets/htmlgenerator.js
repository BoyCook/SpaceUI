
function HTMLGenerator() {
	this._loadTemplates();
	this._registerHandlers();
}

HTMLGenerator.prototype.generateViewTiddler = function(tiddler) {
	return this.templates.view(tiddler);
};

HTMLGenerator.prototype.generateEditTiddler = function(tiddler) {
	return this.templates.edit(tiddler);
};

HTMLGenerator.prototype.generateTiddlersList = function(items) {
	return this.templates.tiddlers(items);	
};

HTMLGenerator.prototype.generateTagsList = function(items) {
	return this.templates.tags(items);
};

HTMLGenerator.prototype.generateTiddlerItem = function(tiddler) {
	return this.templates.item(tiddler);	
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

HTMLGenerator.prototype._loadTemplates = function() {
	this.templates = {
		view: Handlebars.compile($("#tiddler-view-template").html()),
		edit: Handlebars.compile($("#tiddler-edit-template").html()),
		tiddlers: Handlebars.compile($("#tiddler-list-template").html()),
		item: Handlebars.compile($("#tiddler-item-template").html()),
		tags: Handlebars.compile($("#tag-list-template").html())
	};	
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
