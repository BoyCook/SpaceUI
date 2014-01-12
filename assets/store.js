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
            cached: 'tiddlers-cached',
            tags: 'tiddler-tags'
        }
    };
}

Store.hasStorage = function(title) {
    return typeof(Storage) !== "undefined";
};

Store.prototype.getCacheList = function() {
    return this.asArray(this.getItem(this.keys.lists.cached));
};

Store.prototype.cacheTiddler = function(tiddler) {
    var list = this.getCacheList();
    if (list.indexOf(tiddler.title) === -1) {
        list.push(tiddler.title);
        this.setItem(this.keys.lists.cached, list);
    }
};

Store.prototype.deCacheTiddler = function(tiddler) {
    var list = this.getItem(this.keys.lists.cached);
    var index = list.indexOf(tiddler.title); 
    if (index === -1) {
        list.splice(index, 1);
        this.setItem(this.keys.lists.cached, list);
    }
};

Store.prototype.getTiddler = function(title) {
    return this.getItem(this.keys.tiddler + title);
};

Store.prototype.setTiddler = function(tiddler) {
    this.setItem(this.keys.tiddler + tiddler.title, tiddler);
};

Store.prototype.getPublicTiddlers = function() {
    return this.asArray(this.getItem(this.keys.lists.public));
};

Store.prototype.setPublicTiddlers = function(tiddlers) {
    this.setTiddlers(this.keys.lists.public, tiddlers);
};

Store.prototype.getPrivateTiddlers = function() {
    return this.asArray(this.getItem(this.keys.lists.private));
};

Store.prototype.setPrivateTiddlers = function(tiddlers) {
    this.setTiddlers(this.keys.lists.private, tiddlers);
};

Store.prototype.getTags = function() {
    return this.asArray(this.getItem(this.keys.lists.tags));
};

Store.prototype.setTags = function(tags) {
    this.setTiddlers(this.keys.lists.tags, tags);
};

Store.prototype.setTiddlers = function(name, tiddlers) {
    this.setItem(name, tiddlers);
};

Store.prototype.removeTiddler = function(title) {
    localStorage.removeItem(this.keys.tiddler + title);
};

Store.prototype.asArray = function(data) {
    if (data instanceof Array) {
        return data;
    } else if (this.isUndefined(data)) {
        return [];
    } else {
        return [data];
    }
};

Store.prototype.getItem = function(name) {
    return this._return(JSON.parse(localStorage.getItem(name)));
};

Store.prototype.setItem = function(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
};

Store.prototype.isItem = function(name) {
    return !(localStorage.getItem(name) === null);
};

Store.prototype.isUndefined = function(data) {
    return typeof data === "undefined" || 
        typeof data === "null" || 
        data === undefined ||
        data === null;
};

Store.prototype._return = function(data) {
    if (this.isUndefined(data)) {
        return undefined;
    } else {
        return data;
    }
};

if (!(typeof exports === "undefined")) {
    exports.Store = Store;
}
