
function Space(baseURL, name) {
	this.baseURL = baseURL;
	this.name = name;
	this.bagName = this.name + '_public';
	this.tiddlers = {};
    this.tiddlerList = [];
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
    for (var i=0,len=this.tiddlerList.length; i < len; i++) {
        var item = this.tiddlerList[i];
        if (item.title == title) {
            return item;
        }
    }    
};

Space.prototype.addToList = function(tiddler) {
    if (this.tiddlerList.unshift) {
        this.tiddlerList.unshift(tiddler);
    } else {
        this.tiddlerList.push(tiddler);
    }
};

Space.prototype.removeFromList = function(tiddler) {
    for (var i=0,len=this.tiddlerList.length; i < len; i++) {
        var item = this.tiddlerList[i];
        if (item.title == tiddler.title) {
            this.tiddlerList.splice(i, 1);
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

Space.prototype.getRecent = function(success, error) {
	this.getAll('?sort=-modified;limit=100', success, error);
};

Space.prototype.getAll = function(params, success, error) {
    var context = this;
    var callBack = function(data) {
        for (var i=0,len=data.length; i < len; i++) {
            data[i].id = context.getId(data[i]);
        }
        context.tiddlerList = data;
        if (success) {
            success(data);
        }
    };
    this.http.doGet(this.baseURL + '/recipes/' + this.name + '_public/tiddlers' + params, callBack, error);
};

Space.prototype.saveTiddler = function(tiddler, success, error) {
    // xml, json, script, or html
    this.http.doPut(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, 
        tiddler.contentType, 'json', tiddler, success, error)
};

Space.prototype.deleteTiddler = function(tiddler, success, error) {
    var context = this;
    var callBack = function() {
        context.removeTiddler(tiddler.title);
        if (success) {
            success();
        }
    }
    this.http.doDelete(this.baseURL + '/bags/' + tiddler.bag + '/tiddlers/' + tiddler.title, 
        tiddler.type, 'json', callBack, error)
};

Space.prototype.getId = function(tiddler) {
    return 'tiddler' + tiddler.title.replace(/ /g,"_").replace(/\./g,"_").replace(/\?/g,"_");
};
