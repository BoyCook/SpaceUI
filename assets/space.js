
function Space(baseURL, name, parent) {
	this.baseURL = baseURL;
	this.name = name;
	this.tiddlers = {};
    this.lists = {
        tiddlers: {
            "public": [],
            "private": [],
            "cached": []
        },
        tags: []
    };
    this.store = new Store();
    this.http = new HTTP();
    this.parent = parent;
}

Space.prototype.init = function() {
    //TODO: init local state
};

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
    // return this.tiddlers[title];
    return this.store.getTiddler(title);
};

Space.prototype.removeTiddler = function(title) {
    delete this.tiddlers[title];
};

Space.prototype.setTiddler = function(tiddler) {
    this.store.setTiddler(tiddler);
    this.tiddlers[tiddler.title] = tiddler;
};

Space.prototype.getSummaryTiddler = function(title) {
    var summary = this._getTiddlerByTitle(title, this.lists.tiddlers.public);
    if (typeof summary === "undefined") {
        summary = this._getTiddlerByTitle(title, this.lists.tiddlers.private);
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
    this.lists.tiddlers.public = tiddlers;
};

Space.prototype._setPrivateTiddlers = function(tiddlers) {
    this.lists.tiddlers.private = tiddlers;
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
    this.lists.tags = tags;
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
        this._addToList(tiddler, this.lists.tiddlers.private);
    } else {
        this._addToList(tiddler, this.lists.tiddlers.public);
    }
};

Space.prototype._addToList = function(tiddler, list) {
    //Move to top of list???
    if (list.unshift) {
        list.unshift(tiddler);
    } else {
        list.push(tiddler);
    }       
};

Space.prototype.removeSummaryTiddler = function(tiddler) {
    if (this.isPrivate(tiddler)) {
        this._removeFromList(tiddler, this.lists.tiddlers.private);
    } else {
        this._removeFromList(tiddler, this.lists.tiddlers.public);
    }
};

Space.prototype._removeFromList = function(tiddler, list) {
    for (var i=0,len=list.length; i < len; i++) {
        var item = list[i];
        if (item.title === tiddler.title) {
            list.splice(i, 1);
            return;
        }
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

Space.prototype.saveTiddler = function(tiddler, success, error) {
    var context = this;
    var callBack = function() {
        context._addSummaryTiddler(tiddler);
        if (success) {
            success.call(context.parent, tiddler);
        }
    };
    var fail = function() {
    /*
        TODO: - if save fails mark tiddler for resubmit
              - add list of unsubbmitted tiddlers (highlight red???)  
              - submit when back online
    */
    };
    this.http.doPut(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, tiddler, callBack, error);
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
    var fail = function() {
    /*
        TODO: - if delete fails mark tiddler for resubmit
              - add list of unsubbmitted tiddlers (highlight red???)  
              - submit when back online
    */
    };
    this.http.doDelete(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, callBack, error);
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
