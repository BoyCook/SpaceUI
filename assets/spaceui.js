var app = undefined;

$(document).ready(function () {
    app = new SPA(window.location.hostname, window.location.port);
    app.setup();
});

function SPA(host, port) {
    this.baseURL = "http://" + host + ':' + port;  

    if (host === 'localhost') {
        this.spaceName = 'spaceui';
    } else if (host.indexOf('.') > 0) {
        this.spaceName = host.substring(0, host.indexOf('.'));
    } else {
        this.spaceName = host;
    }

	this.html = new HTMLGenerator();
    this.space = new Space(this.baseURL, this.spaceName);
}

SPA.prototype.setup = function() {
    $('title').text(this.spaceName);
    $('header h1').text(this.spaceName);    
	this.getRecent(); 
    //TODO - read this from DefaultTiddler tiddler
    this.openTiddler('Space UI');
};

SPA.prototype.getRecent = function() {
	var context = this;	
	var success = function(data) {
		context.renderTiddlers(data);
	};
    this.space.getRecent(success, this.ajaxError);
};

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
};

SPA.prototype.closeAllTiddlers = function() {
    $('.tiddler').remove();
};

SPA.prototype.closeTiddler = function(id) {
    $('#' + id).remove();
};

SPA.prototype.newTiddler = function() {
    var id = 'tiddlerNew_Tiddler';
    //Only if New Tiddler box not open
    if ($('#' + id).length == 0) {
        var tiddler = { title: 'New Tiddler', id: id, text: "Type the text for 'New Tiddler'", tags: '' };
        var html = this.html.generateEditTiddler(tiddler);
        $('#content').prepend(html);  
    }
};

SPA.prototype.editTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    var html = this.html.generateEditTiddler(tiddler);
    $('#' + tiddler.id).replaceWith(html);   
};

SPA.prototype.cancelEditTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    if (typeof tiddler === "undefined") {
        $('#' + this.space.getId({title: title})).remove();   
    } else {
        var html = this.html.generateViewTiddler(tiddler);
        $('#' + tiddler.id).replaceWith(html);           
    }
};

SPA.prototype.saveTiddler = function(title) {
    var context = this; 
    var tiddler = this.space.tiddlers[title];

    if (typeof tiddler === "undefined") {
        var id = this.space.getId({title: title});
        tiddler = {};
        tiddler.title = $('#' + id + ' .tiddler-title').val();
        tiddler.text = $('#' + id + ' .tiddler-text').val();
        tiddler.tags = $('#' + id + ' .tiddler-tags').val().split(' ');
        this.space.createTiddler(tiddler, function() {
            $('#tiddlerNew_Tiddler').remove();
            context.openTiddler(tiddler.title);
        }, this.ajaxError);
    } else {
        tiddler.title = $('#' + tiddler.id + ' .tiddler-title').val();
        tiddler.text = $('#' + tiddler.id + ' .tiddler-text').val();
        tiddler.tags = $('#' + tiddler.id + ' .tiddler-tags').val().split(' ');
        this.space.updateTiddler(tiddler, function() {
            context.openTiddler(tiddler.title);
        }, this.ajaxError);
    }
};

SPA.prototype.deleteTiddler = function(title) {
    var tiddler = this.space.tiddlers[title];
    var success = function() {
        $('#' + tiddler.id).remove();
    };
    this.space.deleteTiddler(title, success, this.ajaxError);
};

SPA.prototype.renderTiddlers = function(tiddlers) {
	var html = '';
	for (var i=0,len=tiddlers.length; i<len; i++) {
		html += this.html.generateTiddlerList(tiddlers[i]);
	}
   $('.nav').html(html);	
};

SPA.prototype.renderTiddler = function(tiddler) {
   $('#content').prepend(this.html.generateViewTiddler(tiddler));	
};

SPA.prototype.ajaxError = function(xhr, error, exc) {
	alert(error);
};
