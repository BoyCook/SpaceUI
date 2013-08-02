var app = undefined;

$(document).ready(function () {
    app = new SPA(window.location.hostname, window.location.port);
    app.setup();

    $('#filterBox').keyup(function (e) {
        if (!(e.keyCode >= 37 && e.keyCode <= 40)) {
            app.filter($('#filterBox').val());
        }
    });    
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
    this.tiddlerFilter = undefined;
	this.html = new HTMLGenerator();
    this.space = new Space(this.baseURL, this.spaceName);
    this.newTiddlerJSON = {
        id: 'tiddlerNew_Tiddler',
        title: 'New Tiddler',
        text: "Type the text for 'New Tiddler'",
        tags: ''
    };
}

SPA.prototype.setup = function() {
    this.loadTitle();
	this.getRecent(); 
    this.loadDefaults();
};

SPA.prototype.loadTitle = function() {
    var context = this;
    this.space.getTiddler('SiteTitle', function(titleTiddler) {
        var title = titleTiddler.text;
        context.space.getTiddler('SiteSubtitle', function(subTitleTiddler){
            title += ' - ' + subTitleTiddler.text;
            $('title').text(title);
            $('header h1').text(title);                
        }, context.ajaxError);                    
    }, context.ajaxError);        
};

SPA.prototype.loadDefaults = function() {
    var context = this;
    //The titles in the text will be wrapped in [[Square braces]] - this will remove them
    var processItems = function(text) {
        var items = text.split(']] [[');
        //Clean left '[['
        items[0] = items[0].substring(2);
        //Clean right ']]'
        items[items.length-1] = items[items.length-1].substring(0, items[items.length-1].indexOf(']]'));        
        return items;
    };

    this.space.getTiddler('DefaultTiddlers', function(defaultTiddlers) {
        var items = processItems(defaultTiddlers.text);
        var len = items.length -1;
        for (var i=len; i>=0; i--) {
            context.openTiddler(items[i]);
        }
    }, this.ajaxError);        
};

SPA.prototype.getRecent = function() {
	var context = this;	
	var success = function(data) {
		context.renderTiddlerList(data);
        context.tiddlerFilter = new Filter(data);
	};
    this.space.getRecent(success, this.ajaxError);
};

SPA.prototype.filter = function(text) {
    var filtered = this.tiddlerFilter.filter('title', text);
    this.renderTiddlerList(filtered);
};

SPA.prototype.openTiddler = function(title) {
    var context = this; 
    var success = function(data) {
        context.renderTiddler(data);
    };

    //TODO: load based on type i.e. fix image loading
    //TODO: tidy this
    var tiddler = this.space.tiddlers[title];
    if (typeof tiddler === "undefined") {
        this.space.getTiddler(title, success, this.ajaxError);        
    } else {
        if ($('#' + tiddler.id).length == 0) {
            this.space.getTiddler(title, success, this.ajaxError);        
        }
        // window.history.pushState(null, null, '#' + tiddler.id)
    }
};

SPA.prototype.closeAllTiddlers = function() {
    $('.tiddler').remove();
};

SPA.prototype.closeTiddler = function(id) {
    $('#' + id).remove();
};

SPA.prototype.newTiddler = function() {
    var tiddler = this.space.tiddlers[this.newTiddlerJSON.title];

    if (typeof tiddler === "undefined") {
        var html = this.html.generateEditTiddler(this.newTiddlerJSON);
        $('#content').prepend(html);  
    } else {
        // If 'New Tiddler' exists then open it and becomes update operation
        this.editTiddler(this.newTiddlerJSON.title);
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
        this.space.saveTiddler(tiddler, function() {
            $.growl.notice({ title: 'Success',  message: 'Added tiddler ' + title });
            $('#tiddlerNew_Tiddler').remove();
            context.addToList(tiddler);
            context.openTiddler(tiddler.title);
        }, this.ajaxError);
    } else {
        tiddler.title = $('#' + tiddler.id + ' .tiddler-title').val();
        tiddler.text = $('#' + tiddler.id + ' .tiddler-text').val();
        tiddler.tags = $('#' + tiddler.id + ' .tiddler-tags').val().split(' ');
        this.space.saveTiddler(tiddler, function() {
            $.growl.notice({ title: 'Success',  message: 'Updated tiddler ' + title });
            $('#' + tiddler.id).remove();
            context.space.removeTiddler(tiddler.title);
            context.moveToTopOfList(tiddler);
            context.openTiddler(tiddler.title);
        }, this.ajaxError);
    }
};

SPA.prototype.deleteTiddler = function(title) {
    var context = this;
    var tiddler = this.space.tiddlers[title];
    var success = function() {
        $.growl.notice({ title: 'Success', message: 'Deleted tiddler ' + title });
        $('#' + tiddler.id).remove();
        context.removeFromList(tiddler);
    };
    this.space.deleteTiddler(title, success, this.ajaxError);
};

SPA.prototype.viewMenu = function(tiddlers) {
    if ($('nav').hasClass('visible')) {
        $('nav').removeClass('visible');
    } else {
        $('nav').addClass('visible');
    }
};

SPA.prototype.addToList = function(tiddler) {
    this.space.addToList(tiddler);
    this.tiddlerFilter.data = this.space.tiddlerList;
    var item = this.html.generateTiddlerItem(tiddler);
    $(item.asHTML()).insertAfter('nav ul li:first-child')
};

SPA.prototype.removeFromList = function(tiddler) {
    this.space.removeFromList(tiddler);
    this.tiddlerFilter.data = this.space.tiddlerList;
    $("nav ul li a[href='#" + tiddler.id + "']").parent().remove()
};

SPA.prototype.moveToTopOfList = function(tiddler) {
    var original = $("nav ul li a[href='#" + tiddler.id + "']").parent();
    var item = original.clone();
    original.remove();
    $(item).insertAfter('nav ul li:first-child')
};

SPA.prototype.renderTiddlerList = function(tiddlers) {
    if ($('nav ul li').length > 1) {
        $('nav ul li:not(:first-child)').remove();
    } 
    $('.nav ul').append(this.html.generateTiddlersList(tiddlers).getChildren());   
};

SPA.prototype.renderTiddler = function(tiddler) {
   $('#content').prepend(this.html.generateViewTiddler(tiddler));	
};

SPA.prototype.ajaxError = function(xhr, error, exc) {
    var defaultText = 'There was an unknown error - check your connectivity';
    var text = (xhr.responseText !== '' ? xhr.responseText : (xhr.statusText !== '' ? xhr.statusText : defaultText));
    var msg = 'ERROR (' + xhr.status + ') [' + text + ']';
    console.log(msg);
    $.growl.error({ message: msg });
};
