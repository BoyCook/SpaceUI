/*
    Some overrides for storing objects
*/
Storage.prototype.setItem = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
};

Storage.prototype.getItem = function(key) {
    return JSON.parse(this.getItem(key))
};

/*
    Space Store wrapper
*/
function Store() {
	//Local storage wrapper for tiddlers
    // this.setup();
    this.prefix = 'tiddlyspace-tiddler-';
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
    return localStorage.getItem(this.prefix = 'tiddlyspace-tiddler-' + title);
};

Store.prototype.setTiddler = function(tiddler) {
    localStorage.setItem(this.prefix = 'tiddlyspace-tiddler-' + tiddler.title, tiddler);
};

Store.prototype.removeTiddler = function(title) {
    localStorage.removeItem(this.prefix = 'tiddlyspace-tiddler-' + title);
};

Store.prototype.getTiddlers = function() {
	return localStorage.getItem('tiddlers');
};

Store.prototype.setTiddlers = function(tiddlers) {
	localStorage.setItem('tiddlers', tiddlers);
};

Store.prototype._getTiddler = function(title) {
    var tiddlers = this.getTiddlers();
    return tiddlers[title];
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

// var store = new Store();
// var obj1 = { "title": "tiddler1" };
// localStorage.setItem("tiddler1", JSON.stringify(obj1));
// localStorage.getItem("tiddler1");
