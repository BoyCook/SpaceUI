/*
    Space Store wrapper
*/
function Store() {
    this.keys = {
        tiddler: 'tiddlyspace-tiddler-',
        cached: 'tiddlyspace-cached-',
        lists: {
            public: 'tiddlers-public',
            private: 'tiddlers-private',
            cached: 'tiddlers-cached'
        }
    };
}

Store.prototype.setup = function(title) {
    if (!localStorage.key('cachedTiddlers')) {
        localStorage.setItem('cachedTiddlers', []);
    }
};

Store.hasStorage = function(title) {
    return typeof(Storage) !== "undefined";
};

Store.prototype.updateCache = function(tiddler) {
    var list = this.getItem(this.keys.list.cached);
    var key = this.keys.cached + tiddler.title;

    this.setItem(key, tiddler);
    if (list.indexOf(key) == -1) {
        list.push(key);
        this.setItem(this.keys.list.cached, list);
    }
};

Store.prototype.getTiddler = function(title) {
    return this.getItem(this.keys.tiddler + title);
};

Store.prototype.setTiddler = function(tiddler) {
    this.setItem(this.keys.tiddler + tiddler.title, tiddler);
};

Store.prototype.setPublicTiddlers = function(name, tiddlers) {
    this.setTiddlers(this.keys.list.public, tiddlers)
};

Store.prototype.setPrivateTiddlers = function(name, tiddlers) {
    this.setTiddlers(this.keys.list.private, tiddlers)
};

Store.prototype.setTiddlers = function(name, tiddler) {
    this.setItem(name, tiddlers);
};

Store.prototype.removeTiddler = function(title) {
    localStorage.removeItem(this.keys.tiddler + title);
};

Store.prototype.getItem = function(name) {
    return this._return(JSON.parse(localStorage.getItem(name)));
};

Store.prototype.setItem = function(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
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
