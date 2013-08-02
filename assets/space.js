
function Space(baseURL, name) {
	this.baseURL = baseURL;
	this.name = name;
	this.bagName = this.name + '_public';
	this.tiddlers = {};
    this.tiddlerList = [];
    this.http = new HTTP();
}

Space.prototype.getTiddler = function(title, success, error) {
	var tiddler = this.tiddlers[title]; 
	if (typeof tiddler === "undefined") {
		this._getTiddler(title, success, error);
	} else {
        if (success) {
            success(tiddler);
        }
    }
};

Space.prototype._getTiddler = function(title, success, error) {
    var context = this;
    var callBack = function(tiddler) {
        tiddler.id = context.getId(tiddler);
        context.setTiddler(tiddler);
        if (success) {
            success(tiddler);
        }
    }
	this.http.doGet(this.baseURL + '/bags/' + this.bagName + '/tiddlers/' + title + '?render=1', callBack, error);
};

Space.prototype.removeTiddler = function(title) {
    delete this.tiddlers[title];
};

Space.prototype.setTiddler = function(tiddler) {
    this.tiddlers[tiddler.title] = tiddler;
};

Space.prototype.addToList = function(tiddler) {
    if (this.tiddlerList.unshift) {
        this.tiddlerList.unshift(tiddler);
    } else {
        this.tiddlerList.push(tiddler);
    }
};

Space.prototype.removeFromList = function(tiddler) {
    for (var i=0,len=this.tiddlerList.length; i<len; i++) {
        var item = this.tiddlerList[i];
        if (item.title == tiddler.title) {
            this.tiddlerList.splice(i, 1);
            return;
        }
    }
};

Space.prototype.getRecent = function(success, error) {
	this.getAll('?sort=-modified;limit=50', success, error);
};

Space.prototype.getAll = function(params, success, error) {
    var context = this;
    var callBack = function(data) {
         context.tiddlerList = data;
         if (success) {
             success(data);
         }
    };
	this.http.doGet(this.baseURL + '/bags/' + this.bagName + '/tiddlers' + params, callBack, error);
};

Space.prototype.saveTiddler = function(tiddler, success, error) {
    this.http.doPut(this.baseURL + '/bags/' + this.bagName + '/tiddlers/' + tiddler.title, tiddler, success, error)
};

Space.prototype.deleteTiddler = function(title, success, error) {
    var context = this;
    var callBack = function() {
        context.removeTiddler(title);
        if (success) {
            success();
        }
    }
    this.http.doDelete(this.baseURL + '/bags/' + this.bagName + '/tiddlers/' + title, callBack, error)
};

Space.prototype.getId = function(tiddler) {
    return 'tiddler' + tiddler.title.replace(/ /g,"_").replace(/\./g,"_");
};
