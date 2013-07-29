
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
	this.load(this.host + '/bags/' + this.bagName + '/tiddlers/' + title + '?render=1', success, error);
};

Space.prototype.getRecent = function(success, error) {
	this.load(this.host + '/bags/spaceui_public/tiddlers?sort=-modified;limit=10', success, this.ajaxError);
};

Space.prototype.getAll = function() {

};

Space.prototype.filter = function() {

};

Space.prototype.createTiddler = function() {

};

Space.prototype.updateTiddler = function() {

};

Space.prototype.deleteTiddler = function() {

};

Space.prototype.load = function(url, success, error) {
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
