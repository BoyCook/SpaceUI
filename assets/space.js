
function Space(baseURL, name) {
	this.baseURL = baseURL;
	this.name = name;
	this.bagName = this.name + '_public';
	this.tiddlers = {};
    this.tiddlerLists = {
        all: [],
        modified: [],
    };
    this.tags = []; //TODO: populate from tiddlerList
    this.http = new HTTP();
}

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
    for (var i=0,len=this.tiddlerLists.all.length; i < len; i++) {
        var item = this.tiddlerLists.all[i];
        if (item.title == title) {
            return item;
        }
    }    
};

Space.prototype.getTiddlerLists = function(tiddlers) {
    return this.tiddlerLists;
};

Space.prototype.setTiddlerLists = function(tiddlers) {
    var sort = new Sort(tiddlers);
    this.tiddlerLists.all = sort.sort('title');
    this.tiddlerLists.modified = sort.sort('-modified');
};

Space.prototype.addToList = function(tiddler) {
    //Move to top of list???
    if (this.tiddlerLists.all.unshift) {
        this.tiddlerLists.all.unshift(tiddler);
    } else {
        this.tiddlerLists.all.push(tiddler);
    }
};

Space.prototype.removeFromList = function(tiddler) {
    for (var i=0,len=this.tiddlerLists.all.length; i < len; i++) {
        var item = this.tiddlerLists.all[i];
        if (item.title == tiddler.title) {
            this.tiddlerLists.all.splice(i, 1);
            return;
        }
    }
};

Space.prototype.moveToTopOfList = function(tiddler) {
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
        for (var i=0,len=data.length; i < len; i++) {
            data[i].id = context.getId(data[i]);
        }
        context.setTiddlerLists(data);
        if (success) {
            success(data);
        }
    };
    this.http.doGet(this.baseURL + '/recipes/' + this.name + '_public/tiddlers' + params, callBack, error);
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
