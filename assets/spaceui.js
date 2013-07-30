var app = undefined;

$(document).ready(function () {
    app = new SPA(window.location.hostname, window.location.port);
    app.setup();
});

function SPA(host, port) {
    this.baseURL = "http://" + host + ':' + port;  
    this.spaceName = (host === 'localhost' ? 'spaceui' : host);
	this.html = new HTMLGenerator();
    this.space = new Space(this.baseURL, this.spaceName);
}

SPA.prototype.setup = function() {
    $('title').text(this.spaceName);
    $('header h1').text(this.spaceName);    
	this.getRecent(); 
    //TODO - read this from DefaultTiddler tiddler
    this.openTiddler('Space UI');
}

SPA.prototype.getRecent = function() {
	var context = this;	
	var success = function(data) {
		context.renderTiddlers(data);
	};
    this.space.getRecent(success, this.ajaxError);
}

SPA.prototype.openTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    if (typeof tiddler === "undefined") {
        var context = this; 
        var success = function(data) {
            context.renderTiddler(data);
        };
        this.space.getTiddler(title, success, this.ajaxError);        
    } else {
        //TODO: jump to tiddler
    }
}

SPA.prototype.closeAllTiddlers = function() {
    $('.tiddler').remove();
}

SPA.prototype.closeTiddler = function(id) {
    $('#' + id).remove();
}

SPA.prototype.newTiddler = function() {
    /* TODO: 
        - generate UI    
        - save to service
    */    
    var id = 'tiddlerNew_Tiddler';
    //Only if not alreay creating tiddler
    if ($('#' + id).length == 0) {
        var tiddler = { title: 'New Tiddler', id: id, text: "Type the text for 'New Tiddler'" };
        var html = this.html.generateEditTiddler(tiddler);
        $('#content').prepend(html);  
    }
}

SPA.prototype.editTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    var html = this.html.generateEditTiddler(tiddler);
    $('#' + tiddler.id).replaceWith(html);   
}

SPA.prototype.cancelEditTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    var html = this.html.generateViewTiddler(tiddler);
    $('#' + tiddler.id).replaceWith(html);   
}

SPA.prototype.saveTiddler = function(id) {

}

SPA.prototype.deleteTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    $('#' + tiddler.id).remove();
    this.space.deleteTiddler(title);
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

SPA.prototype.ajaxError = function(xhr, error, exc) {
	alert(error);
}
