
function Space(baseURL, name, parent) {
	this.baseURL = baseURL;
	this.name = name;
    this.store = new Store();
    this.http = new HTTP();
    this.parent = parent;
}

Space.prototype.fetchTiddler = function(summary, success, error) {
	var tiddler = this.getTiddler(summary.title); 
	if (typeof tiddler === "undefined" || tiddler === null) {
		this._fetchTiddler(summary, success, error);
	} else {
        if (success) {
            success(tiddler);
        }
    }
};

Space.prototype._fetchTiddler = function(summary, success, error) {
    var context = this;
    var callBack = function(tiddler) {
        context.setTiddler(tiddler);
        if (success) {
            success.call(context.parent, tiddler);
        }
    };
	this.http.doGet(this.baseURL + '/bags/' + summary.bag + '/tiddlers/' + summary.title + '?render=1', callBack, error);
};

Space.prototype.getTiddler = function(title) {
    return this.store.getTiddler(title);
};

Space.prototype.removeTiddler = function(title) {
    this.store.removeTiddler(title);
};

// TODO - underscore this
Space.prototype.setTiddler = function(tiddler) {
    this.store.setTiddler(tiddler);
};

Space.prototype.getSummaryTiddler = function(title) {
    var summary = this._getTiddlerByTitle(title, this.store.getPublicTiddlers());
    if (typeof summary === "undefined") {
        summary = this._getTiddlerByTitle(title, this.store.getPrivateTiddlers());
    }
    return summary;
};

Space.prototype._getTiddlerByTitle = function(title, tiddlers) {
    for (var i=0,len=tiddlers.length; i < len; i++) {
        var item = tiddlers[i];
        if (item.title === title) {
            return item;
        }
    }    
    return undefined;
};

Space.prototype._setPublicTiddlers = function(tiddlers) {
    this.store.setPublicTiddlers(tiddlers);
};

Space.prototype._setPrivateTiddlers = function(tiddlers) {
    this.store.setPublicTiddlers(tiddlers);
};

Space.prototype._calculateTags = function(tiddlers) {
    //TODO: make this better
    var tags = [];
    for (var i=0,len=tiddlers.length; i < len; i++) {
        var tiddler = tiddlers[i];
        for (var x=0,tagLen=tiddler.tags.length; x < tagLen; x++) {
            var tag = tiddler.tags[x];
            if (tag.indexOf(',') > -1) {
                var splitTag = tag.split(',');
                for (var y=0,splitTagLen=splitTag.length; y < splitTagLen; y++) {
                    if (tags.indexOf(splitTag[y]) === -1) {
                        tags.push(splitTag[y]);
                    }                    
                }
            } else if (tags.indexOf(tag) === -1) {
                tags.push(tag);
            }
        }
    }
    //TODO - merge
    this.store.setTags(tags);
};

Space.prototype._addSummaryTiddler = function(tiddler) {
    var summary = this.getSummaryTiddler(tiddler.title);
    if (typeof summary === "undefined") {
        tiddler.modified = this.getDate();
        this.addSummaryTiddler(tiddler);
    } else {
        summary.modified = this.getDate();
    }
};

Space.prototype.addSummaryTiddler = function(tiddler) {
    if (this.isPrivate(tiddler)) {
        this.store.addPrivateTiddler(tiddler);
    } else {
        this.store.addPublicTiddler(tiddler);
    }
};

Space.prototype.removeSummaryTiddler = function(tiddler) {
    if (this.isPrivate(tiddler)) {
        this.store.removePrivateTiddler(tiddler);
    } else {
        this.store.removePublicTiddler(tiddler);
    }
};

Space.prototype.getReplies = function(title, success, error) {
    // { "X-ControlView": "false" }
    this.http.doGet(this.baseURL + '/search?q=title:"' + title + '"', success, error);    
};

Space.prototype.getPrivateTiddlers = function(success, error) {
    var context = this;
    var callBack = function(data) {
        // context._calculateTags(data);
        context._setPrivateTiddlers(data);
        if (success) {
            success(data);
        }
    };
    this.http.doGet(this.baseURL + '/bags/' + this.name + '_private/tiddlers', callBack, error);
};

Space.prototype.getPublicTiddlers = function(success, error) {
    var context = this;
    var callBack = function(data) {
        context._calculateTags(data);
        context._setPublicTiddlers(data);
        if (success) {
            success(data);
        }
    };
    this.getRecipe(this.name + '_public', '', callBack, error);
};

Space.prototype.getTiddlersWithTag = function(tag, success, error) {
    this.getRecipe(this.name + '_public', '?select=tag:' + tag, success, error);
};

Space.prototype.getRecipe = function(name, params, success, error) {
    this.http.doGet(this.baseURL + '/recipes/' + name + '/tiddlers' + params, success, error);
};

Space.prototype._cacheSave = function(tiddler) {
    /*
        TODO: - if save fails mark tiddler for resubmit
              - add list of unsubbmitted tiddlers (highlight red???)  
              - submit when back online
    */    
    this._addSummaryTiddler(tiddler);
    this.setTiddler(tiddler);    
    this.store.cacheTiddler(tiddler);
};

Space.prototype._cacheDelete = function(tiddler) {
    /*
        TODO: - if delete fails mark tiddler for resubmit
              - add list of unsubbmitted tiddlers (highlight red???)  
              - submit when back online
        - if it hasn't be created yet, remove from the save cache
        - add to delete cache
    */
    // context.removeTiddler(tiddler.title);        
    // this.store.deCacheTiddler    
    var cached = this.store.cacheTiddler(tiddler);
};

Space.prototype.saveTiddler = function(tiddler, success, error) {
    var context = this;
    var callBack = function() {
        context._addSummaryTiddler(tiddler);
        if (success) {
            success.call(context.parent, tiddler);
        }
    };
    var fail = function(xhr, ex, exc) {
        context._cacheSave(tiddler);
        if (success) {
            success.call(context.parent, tiddler);
        }        
        if (error) {
            error.call(context.parent, xhr, ex, exc);
        }
    };
    this.http.doPut(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, tiddler, callBack, fail);
};

Space.prototype.deleteTiddler = function(tiddler, success, error) {
    var context = this;
    var callBack = function() {
        context.removeSummaryTiddler(tiddler);
        context.removeTiddler(tiddler.title);
        if (success) {
            success.call(context.parent, tiddler);
        }
    };
    var fail = function(xhr, ex, exc) {
        context._cacheDelete(tiddler);
        if (error) {
            error.call(context.parent, xhr, ex, exc);
        }        
    };
    this.http.doDelete(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, callBack, fail);
};

Space.prototype.isPrivate = function(tiddler) {
    return tiddler.bag.indexOf('_private') > -1;
};

Space.prototype.getDate = function() {
    var now = new Date();
    return now.getFullYear() +
        this.toFull((now.getMonth() + 1).toString()) +
        this.toFull(now.getDate().toString()) +
        this.toFull(now.getHours().toString()) +
        this.toFull(now.getMinutes().toString()) +
        this.toFull(now.getSeconds().toString());
};

Space.prototype.toFull = function(v) {
    if (v.length === 1) {
        v = "0" + v;
    }
    return v;
};

if (!(typeof exports === "undefined")) {
    exports.Space = Space;
}
