var app = undefined;

$(document).ready(function () {
    app = new SPA("http://" + window.location.hostname + ':' + window.location.port);
    app.setup();
});

function SPA(host) {
    this.host = host;
	this.currentSpace = host.substring(host.indexOf('://') + 3, host.indexOf('.'));
    this.bagName = (this.currentSpace === 'localhost' ? 'spaceui_public' : this.currentSpace + '__public');
	this.html = new HTMLGenerator();
    this.space = new Space(this.host, this.currentSpace);
}

SPA.prototype.setup = function() {
	this.getRecent(); 
    //TODO - read this from DefaultTiddler tiddler
    this.openTiddler('Space UI');
}

SPA.prototype.loadConfig = function() {
	this.load(this.host + '/bags/' + this.bagName + '/tiddlers/SiteTitle', success, this.ajaxError);
	this.load(this.host + '/bags/' + this.bagName + '/tiddlers/SiteSubTitle', success, this.ajaxError);
}

SPA.prototype.getRecent = function() {
	var context = this;	
	var success = function(data) {
		context.renderTiddlers(data);
	};
    this.space.getRecent(success, this.ajaxError);
}

SPA.prototype.openTiddler = function(title) {
    var context = this; 
    var success = function(data) {
        context.renderTiddler(data);
    };
    this.space.getTiddler(title, success, this.ajaxError);
}

SPA.prototype.editTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    var id = 'tiddler' + tiddler.title.replace(/ /g,"_");
    var html = this.html.generateEditTiddler(tiddler);
    $('#' + id).html(html);   
}

SPA.prototype.renderTiddlers = function(tiddlers) {
	var html = '';
	for (var i=0,len=tiddlers.length; i<len; i++) {
		html += this.html.generateTiddlerList(tiddlers[i]);
	}
   $('.nav').html(html);	
}

SPA.prototype.renderTiddler = function(tiddler) {
   $('#content').prepend(this.html.generateViewTiddler(tiddler));	
}

SPA.prototype.load = function(url, success, error) {
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

SPA.prototype.ajaxError = function(xhr, error, exc) {
	alert(error);
}
