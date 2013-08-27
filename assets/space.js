
function Space(baseURL, name) {
	this.baseURL = baseURL;
	this.name = name;
	this.bagName = this.name + '_public';
	this.tiddlers = {};
    this.lists = {
        all: [],
        modified: [],
        tags: []
    };
    this.http = new HTTP();
}

Space.prototype._init = function() {
    //TODO: init local state
};

Space.prototype.fetchTiddler = function(summary, success, error) {
	var tiddler = this.getTiddler(summary.title); 
	if (typeof tiddler === "undefined") {
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
        tiddler.id = context.getId(tiddler);
        context.setTiddler(tiddler);
        if (success) {
            success(tiddler);
        }
    }
	this.http.doGet(this.baseURL + '/bags/' + summary.bag + '/tiddlers/' + summary.title + '?render=1', callBack, error);
};

Space.prototype.getTiddler = function(title) {
    return this.tiddlers[title];
};

Space.prototype.removeTiddler = function(title) {
    delete this.tiddlers[title];
};

Space.prototype.setTiddler = function(tiddler) {
    this.tiddlers[tiddler.title] = tiddler;
};

Space.prototype.getSummaryTiddler = function(title) {
    for (var i=0,len=this.lists.all.length; i < len; i++) {
        var item = this.lists.all[i];
        if (item.title == title) {
            return item;
        }
    }    
};

Space.prototype.getLists = function(tiddlers) {
    return this.lists;
};

Space.prototype._setTiddlerLists = function(tiddlers) {
    var sort = new Sort(tiddlers);
    this.lists.all = sort.sort('title');
    this.lists.modified = sort.sort('-modified');
};

Space.prototype._calculateTags = function(tiddlers) {
    //TODO: make this better
    var tags = [];
    for (var i=0,len=tiddlers.length; i < len; i++) {
        var tiddler = tiddlers[i];
        for (var x=0,tagLen=tiddler.tags.length; x < tagLen; x++) {
            var tag = tiddler.tags[x];
            if (tag == '') {

            } else if (tag.indexOf(',') > -1) {
                var splitTag = tag.split(',');
                for (var y=0,splitTagLen=splitTag.length; y < splitTagLen; y++) {
                    if (tags.indexOf(splitTag[y]) == -1) {
                        tags.push(splitTag[y]);
                    }                    
                }
            } else if (tags.indexOf(tag) == -1) {
                tags.push(tag);
            }
        }
    }
    this.lists.tags = tags;
};

Space.prototype._checkItems = function(list, items) {
    for (var i=0,len=items.length; i < len; i++) {
        var item = items[i];
        if (item.indexOf(',') > -1) {
            this.__checkItems(list, item.split(','));
        } else if (list.indexOf(item) == -1) {
            list.push(item);
        }                    
    }
};

Space.prototype._populateTiddlerIDs = function(tiddlers) {
    for (var i=0,len=tiddlers.length; i < len; i++) {
        tiddlers[i].id = this.getId(tiddlers[i]);
    }
};

Space.prototype.addToList = function(tiddler) {
    //TODO: specify list
    //Move to bottom of list???
    if (this.lists.all.unshift) {
        this.lists.all.unshift(tiddler);
    } else {
        this.lists.all.push(tiddler);
    }
};

Space.prototype.removeFromList = function(tiddler) {
    //TODO: specify list
    for (var i=0,len=this.lists.all.length; i < len; i++) {
        var item = this.lists.all[i];
        if (item.title == tiddler.title) {
            this.lists.all.splice(i, 1);
            return;
        }
    }
};

Space.prototype.moveToTopOfList = function(tiddler) {
    //TODO: specify list
    this.removeFromList(tiddler);
    this.addToList(tiddler);
};

Space.prototype.getReplies = function(title, success, error) {
    // { "X-ControlView": "false" }
    this.http.doGet(this.baseURL + '/search?q=title:"' + title + '"', success, error);    
};

Space.prototype.getRecentList = function(success, error) {
	this.getAllList('?sort=-modified', success, error);
};

Space.prototype.getAllList = function(params, success, error) {
    var context = this;
    var callBack = function(data) {
        context._populateTiddlerIDs(data);
        context._calculateTags(data);
        context._setTiddlerLists(data);
        if (success) {
            success(data);
        }
    };
    this.getRecipe(this.name + '_public', params, callBack, error);
};

Space.prototype.getRecipe = function(name, params, success, error) {
    this.http.doGet(this.baseURL + '/recipes/' + name + '/tiddlers' + params, success, error);
};

Space.prototype.saveTiddler = function(tiddler, success, error) {
    // xml, json, script, or html
    delete tiddler.render;
    this.http.doPut(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, tiddler, success, error);
};

Space.prototype.deleteTiddler = function(tiddler, success, error) {
    var context = this;
    var callBack = function() {
        context.removeTiddler(tiddler.title);
        if (success) {
            success();
        }
    }
    this.http.doDelete(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, callBack, error);
};

Space.prototype.getId = function(tiddler) {
    return 'tiddler' + tiddler.title.replace(/ /g,"_").replace(/\./g,"_").replace(/\?/g,"_");
};
