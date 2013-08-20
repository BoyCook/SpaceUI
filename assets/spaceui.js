var app = undefined;

$(document).ready(function () {
    app = new SPA(window.location.hostname, window.location.port);
    app.setup();

    $('#filterBox').keyup(function (e) {
        if (!(e.keyCode >= 37 && e.keyCode <= 40)) {
            app.filter($('#filterBox').val());
        }
    });    
    $('input:radio[name=searchType]').change(function() {
        var list = $('input:radio[name=searchType]:checked').val();
        $('#filterBox').val(app.filteredLists[list].text);
        app.switchList(list);
    })
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
    this.filteredLists = {
        all: undefined,
        modified: undefined,
        public: undefined,
        private: undefined,
        tags: undefined
    };
    // this.tiddlerFilter = undefined;
	this.html = new HTMLGenerator();
    this.space = new Space(this.baseURL, this.spaceName);
}

SPA.prototype.setup = function() {
    var context = this;
    var done = function(){
        context.loadTitle();
        context.loadDefaults();        
    };
    this.getAllList(done); 
    this.switchList($('input:radio[name=searchType]:checked').val());
};

SPA.prototype.loadTitle = function() {
    var context = this;
    this.space.fetchTiddler({ title: 'SiteTitle', bag:  context.spaceName + '_public'}, 
        function(titleTiddler) {
            var title = titleTiddler.text;
            context.space.fetchTiddler({ title: 'SiteSubtitle', bag:  context.spaceName + '_public'}, 
                function(subTitleTiddler){
                    title += ' - ' + subTitleTiddler.text;
                    $('title').text(title);
                    $('header h1').text(title);                
            }, context.ajaxError);                    
    }, context.ajaxError);        
};

SPA.prototype.stripChars = function(text, left, right) {
    var chars = right + left;
    var items = text.split(chars);
    //Clean left 'chars'
    items[0] = items[0].substring(left.length);
    //Clean right 'chars'
    items[items.length-1] = items[items.length-1].substring(0, items[items.length-1].indexOf(right));        
    return items;
};

SPA.prototype.stripNewLines = function(text) {
    return text.replace(/(\r\n|\n|\r)/gm, '');
};

SPA.prototype.stripDoubleWhiteSpaces = function(text) {
    return text.replace(/\]\]\s+/g, ']]');
    // return text.replace(/\s+/g, ' ');
};

SPA.prototype.loadDefaults = function() {
    var context = this;
    this.space.fetchTiddler({ title: 'DefaultTiddlers', bag:  context.spaceName + '_public'}, 
        function(defaultTiddlers) {
            var text = context.stripDoubleWhiteSpaces(context.stripNewLines(defaultTiddlers.text));
            var items = context.stripChars(text, '[[', ']]');
            var len = items.length -1;
            //TODO: open each tiddler in the correct order
            for (var i=len; i>=0; i--) {
                context.openTiddler(items[i]);
            }
    }, this.ajaxError);        
};

SPA.prototype.viewFullScreen = function(id) {
    this.toggleViewScreen(id);
};

SPA.prototype.editFullScreen = function(id) {
    this.toggleViewScreen(id);
};

SPA.prototype.toggleViewScreen = function(id) {
    // - Hide/show all other content
    // - Make current tiddler size of full screen
    if ($('nav').hasClass('hidden')) {
        $('nav, header, #content .tiddler:not(#' + id + ')').removeClass('hidden');
        $('#content').removeClass('full-width');
        var toolbar = $('#' + id + ' .main-toolbar');
        toolbar.removeClass('main-toolbar');        
        toolbar.addClass('toolbar');
    } else {
        $('nav, header, #content .tiddler:not(#' + id + ')').addClass('hidden');
        $('#content').addClass('full-width');
        var toolbar = $('#' + id + ' .toolbar');
        toolbar.removeClass('toolbar');
        toolbar.addClass('main-toolbar');
    }
};

SPA.prototype.openTiddler = function(title) {
    var context = this; 
    var success = function(data) {
        context.renderTiddler(data);
    };
    var summary = this.space.getSummaryTiddler(title);
    var tiddler = this.space.getTiddler(title);
    if (typeof summary !== "undefined") {
        var tiddler = this.space.getTiddler(summary.title);
        var fetch = this.isDoFetch(summary, tiddler);
        if (fetch == true) {
            this.space.fetchTiddler(summary, success, this.ajaxError);        
        } else {
            if ($('#' + this.space.getId(summary)).length == 0) {
                this.renderTiddler(typeof tiddler !== "undefined" ? tiddler : summary); 
            }
            //else anchor click jumps to tiddler
        }
    } else {
        this.newTiddler(title);
        // $.growl.error({ message: "Cannot find tiddler '" + title + "' to open" });        
    }
};

SPA.prototype.isDoFetch = function(summary, tiddler) {
    //Check if tiddler type requires fetch and isn't in cache
    if (this.isFetch(summary) && typeof tiddler === "undefined") {
        return true;
    } else {
        return false;
    }
};

SPA.prototype.isFetch = function(tiddler) {
    var fetch = true;
    switch (tiddler.type) {
        case "application/x-woff":
        case "application/octet-stream":
        case "image/png":                                
        case "image/jpg":
        case "image/jpge":
            fetch = false;
            break;                  
        case "application/javascript":
        case "text/html":
        case "text/css":
        case "application/vnd.ms-fontobject":
        case "image/svg+xml":
        default:
            fetch = true;
            break;                  
    }
    return fetch;
};

SPA.prototype.closeAllTiddlers = function() {
    $('.tiddler').remove();
};

SPA.prototype.closeTiddler = function(id) {
    $('#' + id).remove();
};

SPA.prototype.getTiddlerJSON = function(title) {
    return {
        id: this.space.getId({title: title}),
        title: title,
        text: "Type the text for '" + title + "'",
        tags: ''
    };    
}

SPA.prototype.newTiddler = function(title) {
    var summary = this.getTiddlerJSON(title);
    var tiddler = this.space.tiddlers[summary.title];
    if (typeof tiddler === "undefined") {
        //If box isn't already open
        if ($('#' + summary.id).length == 0) {
            var html = this.html.generateEditTiddler(summary);
            $('#content').prepend(html);  
        }
    } else {
        // If 'New Tiddler' exists then open it and becomes update operation
        this.editTiddler(summary.title);
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
        tiddler.type = $('#' + id + ' .tiddler-type').val();
        tiddler.bag = this.spaceName + '_' + $('#' + id + ' input[name=privacy]:checked').val();
        this.space.saveTiddler(tiddler, function() {
            $.growl.notice({ title: 'Success',  message: 'Added tiddler ' + title });
            $('#' + id).remove();
            context.addToList(tiddler);
            context.openTiddler(tiddler.title);
        }, this.ajaxError);
    } else {
        tiddler.title = $('#' + tiddler.id + ' .tiddler-title').val();
        tiddler.text = $('#' + tiddler.id + ' .tiddler-text').val();
        tiddler.tags = $('#' + tiddler.id + ' .tiddler-tags').val().split(' ');
        tiddler.type = $('#' + tiddler.id + ' .tiddler-type').val();
        //TODO: can a tiddler switch between public/private (or is it delete/copy)
        // tiddler.bag = this.spaceName + '_' + $('#' + id + ' input[name=privacy]:checked').val();
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
    tiddler.type = 'application/json';
    this.space.deleteTiddler(tiddler, success, this.ajaxError);
};

SPA.prototype.viewMenu = function(tiddlers) {
    if ($('nav').hasClass('visible')) {
        $('nav').removeClass('visible');
    } else {
        $('nav').addClass('visible');
    }
};

SPA.prototype.setFilteredLists = function() {
    this.filteredLists.all = new Filter(this.space.getLists().all);
    this.filteredLists.modified = new Filter(this.space.getLists().modified);
    this.filteredLists.tags = new Filter(this.space.getLists().tags);
};

SPA.prototype.getAllList = function(callBack) {
    // http://boycook.tiddlyspace.com/bags/boycook_private/tiddlers
    var context = this; 
    var success = function(data) {
        context.setFilteredLists();
        context.renderTiddlerLists();
        if (callBack) {
            callBack();
        }
    };
    this.space.getAllList('', success, this.ajaxError);
};

SPA.prototype.filter = function(text) {
    var list = $('input:radio[name=searchType]:checked').val();
    var filtered = this.filteredLists[list].filter('title', text);
    this.renderTiddlerList('nav .navigation-list-' + list, filtered);
};

SPA.prototype.switchList = function(name) {
    $('.navigation-list').hide();
    $('.navigation-list-' + name).show();
};

SPA.prototype.addToList = function(tiddler) {
    this.space.addToList(tiddler);
    this.tiddlerFilter.data = this.space.getLists().all;
    var item = this.html.generateTiddlerItem(tiddler);
    $('nav .navigation-list').append(item.asHTML());
};

SPA.prototype.removeFromList = function(tiddler) {
    this.space.removeFromList(tiddler);
    this.tiddlerFilter.data = this.space.getLists().all;
    $("nav ul li a[href='#" + tiddler.id + "']").parent().remove()
};

SPA.prototype.moveToTopOfList = function(tiddler) {
    this.space.moveToTopOfList(tiddler);
    this.tiddlerFilter.data = this.space.getLists().all;
    var original = $("nav ul li a[href='#" + tiddler.id + "']").parent();
    var item = original.clone();
    original.remove();
    $('nav .navigation-list').prepend(item);
};

SPA.prototype.renderTiddlerLists = function() {
    this.renderTiddlerList('nav .navigation-list-modified', this.space.getLists().modified);
    this.renderTiddlerList('nav .navigation-list-all', this.space.getLists().all);
    this.renderTagsList(this.space.getLists().tags);
};

SPA.prototype.renderTiddlerList = function(selector, tiddlers) {
    //TODO: make this faster
    $(selector + ' li').remove();
    $(selector).append(this.html.generateTiddlersList(tiddlers).getChildren());   
};

SPA.prototype.renderTagsList = function(tags) {
    //TODO: make this faster
    $('nav .navigation-list-tags li').remove();
    $('nav .navigation-list-tags').append(this.html.generateTagsList(tags).getChildren());   
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
