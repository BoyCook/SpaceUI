var app = undefined;
var Router = Backbone.Router.extend({
    initialized: true,
    routes: {
        "tiddler/:title/close":      "close",
        "tiddler/:title/open":       "open", 
        "tiddler/:title/edit":       "edit", 
        "tiddler/:title/canceledit": "canceledit", 
        "tiddler/:title/save":       "save", 
        "tiddler/:title/delete":     "delete", 
        "tiddler/:title/maximize":   "maximize", 
        "tiddler/:title/minimize":   "minimze", 
        "tag/:name/open":            "openTag", 
        "menu":                      "menu",  
        "closeall":                  "closeall",  
        "newtiddler":                "newtidder", 
        "maximize/:tiddler":         "maximize",
        "minimize/:tiddler":         "minimze",
        "fullscreen":                "fullscreen"
    },
    menu: function(title) {
        app.viewMenu(); 
    },        
    closeall: function() {
        app.closeAllTiddlers();
    },    
    open: function(title) {
        app.openTiddler(title);
    },    
    close: function(title) {
        app.closeTiddler(title);
    },    
    edit: function(title) {
        app.editTiddler(title);
    },      
    canceledit: function(title) {
        app.cancelEditTiddler(title);
    },             
    save: function(title) {
        app.saveTiddler(title);
    },                 
    delete: function(title) {
        app.deleteTiddler(title);
    },                     
    newtidder: function() {
        app.newTiddler('New Tiddler');
    }, 
    openTag: function(name) {
        app.openTag(name);
    },     
    maximize: function(title) {
        app.toggleViewScreen(title);
    },
    minimze: function(title) {
        app.toggleViewScreen(title);
    },    
    fullscreen: function() {
        app.toggleFullScreen();
    }
});

$(document).ready(function () {
    app = new SPA(window.location.hostname, window.location.port);
    app.setup();
    new Router();
    Backbone.history.start();
    $('#filterBox').keyup(function (e) {
        if (!(e.keyCode >= 37 && e.keyCode <= 40)) {
            app.filter($('#filterBox').val());
        }
    });    
    $('input:radio[name=searchType]').change(function() {
        var list = $('input:radio[name=searchType]:checked').val();
        $('#filterBox').val(app.filteredLists[list].text);
        app.switchList(list);            
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
    this.filteredLists = {
        all: new Filter([]),
        modified: new Filter([]),
        private: new Filter([]),
        tags: new Filter([]),
        loaded: new Filter([])
    };
    // this.tiddlerFilter = undefined;
	this.html = new HTMLGenerator();
    this.space = new Space(this.baseURL, this.spaceName);
    this.maximized = false;
}

SPA.prototype.setup = function() {
    var context = this;
    var done = function(){
        context.loadTitle();
        context.loadDefaults();        
    };
    this.getAllList(done); 
    this.getPrivateTiddlers();
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

SPA.prototype.toggleFullScreen = function() {
    $.growl.warning({ title: 'Coming soon...',  message: "Fullscreen mode isn't implemented yet" });
    // document.getElementById('page').requestFullScreen()
    // document.getElementById('page').webkitRequestFullScreen()
    // document.getElementById('page').webkitRequestFullscreen()    
};

SPA.prototype.toggleViewScreen = function(id) {
    if (this.maximized) {
        this.maximized = false;
        this.minimize(id);
    } else { // Maximize
        this.maximized = true;
        this.maximize(id);
    }
};

SPA.prototype.maximize = function(id) {
    $('nav, header, #content .tiddler:not(#' + id + ')').addClass('hidden');
    $('#content').addClass('full-width');
    $('#' + id + ' .toolbar .icon-resize-small').parent().removeClass('hidden');
    $('#' + id + ' .toolbar .icon-resize-full').parent().addClass('hidden');
    $('#' + id).addClass('no-border');
    var toolbar = $('#' + id + ' .toolbar');
    toolbar.removeClass('toolbar');
    toolbar.addClass('main-toolbar');
};

SPA.prototype.minimize = function(id) {
    $('nav, header, #content .tiddler:not(#' + id + ')').removeClass('hidden');
    $('#content').removeClass('full-width');
    $('#' + id).removeClass('no-border');
    var toolbar = $('#' + id + ' .main-toolbar');
    toolbar.removeClass('main-toolbar');        
    toolbar.addClass('toolbar');
    $('#' + id + ' .toolbar .icon-resize-small').parent().addClass('hidden');
    $('#' + id + ' .toolbar .icon-resize-full').parent().removeClass('hidden');        
};

SPA.prototype.openTiddler = function(title) {
    var context = this; 
    var success = function(data) {
        data.displaydate = new DateAgo(new Date(), context.parseDate(data.modified)).get();
        context.filteredLists.loaded.data.push(data);
        context.renderNavigationList('loaded', context.filteredLists.loaded.data);
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

SPA.prototype.parseDate = function(date) {
    // "YYYY-MM-dd HH:mm:ss"
    return new Date(date.substring(0, 4) + '-' + 
                    date.substring(4, 6) + '-' + 
                    date.substring(6, 8) + ' ' + 
                    date.substring(8, 10) + ':' + 
                    date.substring(10, 12) + ':' + 
                    date.substring(12, 14));
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

SPA.prototype.closeTiddler = function(title) {
    if (this.maximized) {
        this.toggleViewScreen();   
    }
    $('#' + this.space.getId({ title: title })).remove();    
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
    var tiddler = this.space.getTiddler(summary.title);
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
    var tiddler = this.space.getTiddler(title);
    var html = this.html.generateEditTiddler(tiddler);
    $('#' + tiddler.id).replaceWith(html);   
};

SPA.prototype.cancelEditTiddler = function(title) {
    var tiddler = this.space.getTiddler(title);
    if (typeof tiddler === "undefined") {
        $('#' + this.space.getId({title: title})).remove();   
    } else {
        var html = this.html.generateViewTiddler(tiddler);
        $('#' + tiddler.id).replaceWith(html);           
    }
};

SPA.prototype.saveTiddler = function(title) {
    var context = this; 
    var tiddler = this.space.getTiddler(title);
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
    var tiddler = this.space.getTiddler(title);
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

SPA.prototype.openTag = function(tag) {
    $.growl.warning({ title: 'Coming soon...',  message: "Opening tags isn't implemented yet" });
};

SPA.prototype.setFilteredLists = function() {
    this.filteredLists.all = new Filter(this.space.getLists().all);
    this.filteredLists.modified = new Filter(this.space.getLists().modified);
    this.filteredLists.tags = new Filter(this.space.getLists().tags);
};

SPA.prototype.setPrivateFilterList = function() {
    this.filteredLists.private = new Filter(this.space.getLists().private);
};

SPA.prototype.getAllList = function(callBack) {
    var context = this; 
    var success = function(data) {
        context.setFilteredLists();
        context.renderNavigationLists();
        if (callBack) {
            callBack();
        }
    };
    this.space.getAllList('', success, this.ajaxError);
};

SPA.prototype.getPrivateTiddlers = function(callBack) {
    // http://boycook.tiddlyspace.com/bags/boycook_private/tiddlers
    var context = this; 
    var success = function(data) {
        context.setPrivateFilterList();
        context.renderNavigationList('private', context.space.getLists()['private']);
        if (callBack) {
            callBack();
        }
    };
    this.space.getPrivateTiddlers(success, this.ajaxError);
};

SPA.prototype.filter = function(text) {
    var list = $('input:radio[name=searchType]:checked').val();
    var filtered = this.filteredLists[list].filter('title', text);
    this.renderNavigationList(list, filtered);
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

SPA.prototype.renderNavigationLists = function() {
    this.renderNavigationList('modified', this.space.getLists().modified);
    this.renderNavigationList('all', this.space.getLists().all);
    this.renderNavigationList('tags', this.space.getLists().tags);
};

SPA.prototype.renderNavigationList = function(list, data) {
    //TODO: make this faster - do <ul/> replace
    var selector = 'nav .navigation-list-' + list;
    var generator = this._getListTemplate(list);
    $(selector + ' li').remove();
    $(selector).append(generator.call(this.html, data).getChildren());   
};

SPA.prototype._getListTemplate = function(name) {
    var generators = {
        tags: this.html.generateTagsList
    };
    var generator = generators[name];
    return typeof generator === "undefined" ? this.html.generateTiddlersList : generator;
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
