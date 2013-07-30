
function Space(host, name) {
	this.host = host;
	this.name = name;
	this.bagName = 'spaceui_public'; //TODO calculate bag name
	this.tiddlers = {};
}

Space.prototype.getTiddler = function(title, success, error) {
	var tiddler = this.tiddlers[title]; 
	if (typeof tiddler === "undefined") {
		this._getTiddler(title, success, error);
	}	
};

Space.prototype._getTiddler = function(title, success, error) {
    var context = this;
    var callBack = function(data) {
        context.tiddlers[title] = data;
        if (success) {
            success(data);
        }
    }
	this.goGet(this.host + '/bags/' + this.bagName + '/tiddlers/' + title + '?render=1', callBack, error);
};

Space.prototype.getRecent = function(success, error) {
	this.getAll('?sort=-modified;limit=50', success, error);
};

Space.prototype.getAll = function(params, success, error) {
	this.goGet(this.host + '/bags/' + this.bagName + '/tiddlers', success, error);
};

Space.prototype.filter = function() {

};

Space.prototype.createTiddler = function(tiddler) {
    //TODO: service call to create
};

Space.prototype.updateTiddler = function(tiddler) {
    //TODO: service call to update
};

Space.prototype.deleteTiddler = function(title) {
    //TODO: service call to remove
};

Space.prototype.goGet = function(url, success, error) {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(data, status, xhr) {
            success(data);
        },
        error: function(xhr, error, exc) {
            error(xhr, error, exc);
        }
    });	
}

Space.prototype.doPut = function(url, data, success, error) {
    $.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),        
        success: function(data, status, xhr) {
            success(data);
        },
        error: function(xhr, error, exc) {
            error(error);
        }
    });	
}
