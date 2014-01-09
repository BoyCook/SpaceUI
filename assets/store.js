/*
    Space Store wrapper
*/
function Store() {
    // this.setup();
    this.prefix = 'tiddlyspace-tiddler-';
    this.publicTiddlers = 'tiddlers-public';
    this.privateTiddlers = 'tiddlers-private';
}

Store.prototype.setup = function(title) {
    if (!localStorage.key('tiddlers')) {
        localStorage.setItem('tiddlers', []);
    }
};

Store.hasStorage = function(title) {
    return typeof(Storage) !== "undefined";
};

Store.prototype.getTiddler = function(title) {
    return this._return(JSON.parse(localStorage.getItem(this.prefix + title)));
};

Store.prototype.setTiddler = function(tiddler) {
    localStorage.setItem(this.prefix + tiddler.title, JSON.stringify(tiddler));
};

Store.prototype.removeTiddler = function(title) {
    localStorage.removeItem(this.prefix + title);
};

Store.prototype.getTiddlers = function() {
	return this._return(localStorage.getItem('tiddlers'));
};

Store.prototype.setPublicTiddlers = function(name, tiddlers) {
    this.setTiddlers(this.publicTiddlers, tiddlers)
};

Store.prototype.setPrivateTiddlers = function(name, tiddlers) {
    this.setTiddlers(this.privateTiddlers, tiddlers)
};

Store.prototype.setTiddlers = function(name, tiddler) {
	localStorage.setItem(name, JSON.stringify(tiddlers));
};

Store.prototype._getTiddler = function(title) {
    var tiddlers = this.getTiddlers();
    return this._return(tiddlers[title]);
};

Store.prototype._setTiddler = function(tiddler) {
    var tiddlers = this.getTiddlers();
    tiddlers[tiddler.title] = tiddler;
    this.setTiddlers(tiddlers);
};

Store.prototype._removeTiddler = function(title) {
	var tiddlers = this.getTiddlers();
    delete tiddlers[tiddler.title];
    this.setTiddlers(tiddlers);
};

Store.prototype._return = function(data) {
    if (typeof tiddler === "undefined" || 
        typeof tiddler === "null" || 
        tiddler === undefined ||
        tiddler === null) {
        return undefined;
    } else {
        return data;
    }
};
