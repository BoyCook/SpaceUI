function HTMLGenerator(spaceName) {
    this._loadTemplates();
    this._registerHandlers();
    this.spaceName = spaceName;
}

HTMLGenerator.prototype.generateViewTiddler = function (tiddler) {
    return this.templates.view(tiddler);
};

HTMLGenerator.prototype.generateEditTiddler = function (tiddler) {
    return this.templates.edit(tiddler);
};

HTMLGenerator.prototype.generateTiddlersList = function (items) {
    return this.templates.tiddlers(items);
};

HTMLGenerator.prototype.generateTagsList = function (items) {
    return this.templates.tags(items);
};

HTMLGenerator.prototype.generateTiddlerItem = function (tiddler) {
    return this.templates.item(tiddler);
};

HTMLGenerator.prototype.isCode = function (tiddler) {
    return tiddler.type === 'application/json' ||
        tiddler.type === 'application/javascript' ||
        tiddler.type === 'text/javascript' ||
        tiddler.type === 'text/css' ||
        tiddler.type === 'text/html';
};

HTMLGenerator.prototype.isImage = function (tiddler) {
    return tiddler.type === 'image/png' ||
        tiddler.type === 'image/jpeg' ||
        tiddler.type === 'image/jpg';
};

HTMLGenerator.prototype._loadTemplates = function () {
    this.templates = {
        view: Handlebars.compile($("#tiddler-view-template").html()),
        edit: Handlebars.compile($("#tiddler-edit-template").html()),
        tiddlers: Handlebars.compile($("#tiddler-list-template").html()),
        item: Handlebars.compile($("#tiddler-item-template").html()),
        tags: Handlebars.compile($("#tag-list-template").html())
    };
};

HTMLGenerator.prototype._registerHandlers = function () {
    var context = this;
    Handlebars.registerHelper('canEditTiddler', function (options) {
        if (options.hash.bag.indexOf(context.spaceName) === 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('tiddlertags', function (tags) {
        return tags.toString().replace(/\,/g, ' ');
    });
    Handlebars.registerHelper('tiddlertype', function (type, option) {
        if (type === option) {
            return "selected=selected";
        } else {
            return "";
        }
    });
    Handlebars.registerHelper('tiddlertext', function (tiddler) {
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

if (!(typeof exports === "undefined")) {
    exports.HTMLGenerator = HTMLGenerator;
}
