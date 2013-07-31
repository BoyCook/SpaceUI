
function Space(baseURL, name) {
	this.baseURL = baseURL;
	this.name = name;
	this.bagName = this.name + '_public';
	this.tiddlers = {};
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
        context.tiddlers[title] = tiddler;
        if (success) {
            success(tiddler);
        }
    }
	this.http.doGet(this.baseURL + '/bags/' + this.bagName + '/tiddlers/' + title + '?render=1', callBack, error);
};

Space.prototype.getRecent = function(success, error) {
	this.getAll('?sort=-modified;limit=50', success, error);
};

Space.prototype.getAll = function(params, success, error) {
	this.http.doGet(this.baseURL + '/bags/' + this.bagName + '/tiddlers', success, error);
};

Space.prototype.filter = function() {
};

Space.prototype.createTiddler = function(tiddler, success, error) {
    this.http.doPut(this.baseURL + '/bags/' + this.bagName + '/tiddlers/' + tiddler.title, tiddler, success, error)
};

Space.prototype.updateTiddler = function(tiddler) {
    //TODO: service call to update
};

Space.prototype.deleteTiddler = function(title, success, error) {
    var context = this;
    var callBack = function() {
        delete context.tiddlers[title];
        if (success) {
            success();
        }
    }
    this.http.doDelete(this.baseURL + '/bags/' + this.bagName + '/tiddlers/' + title, callBack, error)
};

Space.prototype.getId = function(tiddler) {
    return 'tiddler' + tiddler.title.replace(/ /g,"_").replace(/\./g,"_");
};
