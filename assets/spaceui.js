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
        app.toggleMenu(); 
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
    var loaded = function() {
        new Router();
        Backbone.history.start();
    };
    app = new SPA(window.location.hostname, window.location.port);
    app.setup(loaded);
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
	this.html = new HTMLGenerator();
    this.space = new Space(this.baseURL, this.spaceName, this);
    this.maximized = false;
}

SPA.prototype.setup = function(callBack) {
    var context = this;
    var done = function(){
        context._loadSiteTitle();
        context._loadDefaults(callBack);
    };
    this.getAllList(done); 
    this.getPrivateTiddlers();
    this.switchList($('input:radio[name=searchType]:checked').val());
};

SPA.prototype._loadSiteTitle = function() {
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

SPA.prototype._loadDefaults = function(callBack) {
    var context = this;
    var Loader = function (titles, callBack) {
        this.titles = titles.reverse();
        this.callBack = callBack;
        this.cnt = 0;
        this.execute = function(index) {
            var loader = this;
            index = typeof index === "undefined" ? this.cnt : index;
            if (index == loader.titles.length) {
                return;
            }
          
            var next = function(tiddler) {
                context._tiddlerLoaded(tiddler);
                loader.cnt++;
                //It's done
                if (loader.cnt == loader.titles.length && loader.callBack) {
                    loader.callBack();
                } else {
                    //Do next
                    loader.execute(loader.cnt);
                }
            };
            var summary = context.space.getSummaryTiddler(loader.titles[index]);
            context.space.fetchTiddler(summary, next, context.ajaxError);        
        };
    };   

    this.space.fetchTiddler({ title: 'DefaultTiddlers', bag:  context.spaceName + '_public'}, 
        function(defaultTiddlers) {
            var text = context._stripDoubleWhiteSpaces(context._stripNewLines(defaultTiddlers.text));
            var items = context._stripChars(text, '[[', ']]');
            var len = items.length -1;
            new Loader(items, callBack).execute();
    }, this.ajaxError);        
};

SPA.prototype._stripChars = function(text, left, right) {
    var chars = right + left;
    var items = text.split(chars);
    //Clean left 'chars'
    items[0] = items[0].substring(left.length);
    //Clean right 'chars'
    items[items.length-1] = items[items.length-1].substring(0, items[items.length-1].indexOf(right));        
    return items;
};

SPA.prototype._stripNewLines = function(text) {
    return text.replace(/(\r\n|\n|\r)/gm, '');
};

SPA.prototype._stripDoubleWhiteSpaces = function(text) {
    return text.replace(/\]\]\s+/g, ']]');
    // return text.replace(/\s+/g, ' ');
};

SPA.prototype.toggleFullScreen = function() {
    $.growl.warning({ title: 'Coming soon...',  message: "Fullscreen mode isn't implemented yet" });
    // document.getElementById('page').requestFullScreen()
    // document.getElementById('page').webkitRequestFullScreen()
    // document.getElementById('page').webkitRequestFullscreen()    
};

SPA.prototype.toggleViewScreen = function(title) {
    if (this.maximized) {
        this.maximized = false;
        this.minimize(title);
    } else { // Maximize
        this.maximized = true;
        this.maximize(title);
    }
};

SPA.prototype.maximize = function(title) {
    var selector = "section[data-title='" + title + "']";
    $('nav, header, #content .tiddler:not(' + selector + ')').addClass('hidden');
    $('#content').addClass('full-width');
    $(selector + ' .toolbar .icon-resize-small').parent().removeClass('hidden');
    $(selector + ' .toolbar .icon-resize-full').parent().addClass('hidden');
    $(selector).addClass('no-border');
    var toolbar = $(selector + ' .toolbar');
    toolbar.removeClass('toolbar');
    toolbar.addClass('main-toolbar');
};

SPA.prototype.minimize = function(title) {
    var selector = "section[data-title='" + title + "']";
    $('nav, header, #content .tiddler:not(' + selector + ')').removeClass('hidden');
    $('#content').removeClass('full-width');
    $(selector).removeClass('no-border');
    var toolbar = $(selector + ' .main-toolbar');
    toolbar.removeClass('main-toolbar');        
    toolbar.addClass('toolbar');
    $(selector + ' .toolbar .icon-resize-small').parent().addClass('hidden');
    $(selector + ' .toolbar .icon-resize-full').parent().removeClass('hidden');        
};

SPA.prototype.openTiddler = function(title) {
    var context = this; 
    var summary = this.space.getSummaryTiddler(title);
    var tiddler = this.space.getTiddler(title);
    if (typeof summary !== "undefined") {
        var tiddler = this.space.getTiddler(summary.title);
        var fetch = this.isDoFetch(summary, tiddler);
        if (fetch == true) {
            this.space.fetchTiddler(summary, this._tiddlerLoaded, this.ajaxError);        
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

SPA.prototype._tiddlerLoaded = function(tiddler) {
    this._setTiddlerDate(tiddler);
    this._setLoadedCache(tiddler);
    this.renderTiddler(tiddler);
};

SPA.prototype._setLoadedCache = function(tiddler) {
    this.filteredLists.loaded.data.push(tiddler);
    this.renderNavigationList('loaded', this.html.generateTiddlersList, this.filteredLists.loaded.data);
};

SPA.prototype._setTiddlerDate = function(tiddler) {
    tiddler.displaydate = new DateAgo(new Date(), this._parseDate(tiddler.modified)).get();    
};

SPA.prototype._parseDate = function(date) {
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
    $("section[data-title='" + title + "']").remove();
};

SPA.prototype.getTiddlerJSON = function(title) {
    return {
        title: title,
        text: "Type the text for '" + title + "'",
        tags: ''
    };    
}

SPA.prototype.newTiddler = function(title) {
    var selector = this._getSelector(title);
    var summary = this.getTiddlerJSON(title);
    var tiddler = this.space.getTiddler(summary.title);
    if (typeof tiddler === "undefined") {
        //If box isn't already open
        if ($(selector).length == 0) {
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
    $("section[data-title='" + title + "']").replaceWith(html);
};

SPA.prototype.cancelEditTiddler = function(title) {
    var tiddler = this.space.getTiddler(title);
    var selector = "section[data-title='" + title + "']";
    if (typeof tiddler === "undefined") {
        $(selector).remove();
    } else {
        var html = this.html.generateViewTiddler(tiddler);
        $(selector).replaceWith(html);
    }
};

SPA.prototype.saveTiddler = function(title) {
    var tiddler = this.space.getTiddler(title);
    if (typeof tiddler === "undefined") {
        this.addTiddler({title: title});
    } else {
        this.updateTiddler(tiddler);
    }
};

SPA.prototype.addTiddler = function(tiddler) {
    var context = this; 
    var selector = this._getSelector(tiddler.title);
    this._readTiddlerForm(selector, tiddler);
    tiddler.bag = this.spaceName + '_' + $(selector + ' input[name=privacy]:checked').val();
    this.space.saveTiddler(tiddler, this.addedTiddler, this.ajaxError);
};

SPA.prototype.updateTiddler = function(tiddler) {
    var context = this; 
    var selector = this._getSelector(tiddler.title);
    this._readTiddlerForm(selector, tiddler);
    //TODO: can a tiddler switch between public/private (or is it delete/copy)
    this.space.saveTiddler(tiddler, this.updatedTiddler, this.ajaxError);
};

SPA.prototype.deleteTiddler = function(title) {
    var tiddler = this.space.getTiddler(title);
    tiddler.type = 'application/json';
    this.space.deleteTiddler(tiddler, this.removedTiddler, this.ajaxError);
};

SPA.prototype.addedTiddler = function(tiddler) {
    $.growl.notice({ title: 'Success',  message: 'Added tiddler ' + title });
    $(selector).remove();
    context.addToLists(tiddler);
    context.openTiddler(tiddler.title);    
};

SPA.prototype.updatedTiddler = function(tiddler) {
    $.growl.notice({ title: 'Success',  message: 'Updated tiddler ' + title });
    $("section[data-title='" + title + "']").remove();
    context.space.removeTiddler(tiddler.title);
    context.moveToTopOfList(tiddler);
    context.openTiddler(tiddler.title);
};

SPA.prototype.removedTiddler = function(tiddler) {
    $.growl.notice({ title: 'Success', message: 'Deleted tiddler ' + title });
    $("section[data-title='" + title + "']").remove();
    context.removeFromList(tiddler);
};

SPA.prototype._readTiddlerForm = function(selector, tiddler) {
    tiddler.title = $(selector + ' .tiddler-title').val();
    tiddler.text = $(selector + ' .tiddler-text').val();
    tiddler.tags = $(selector + ' .tiddler-tags').val().split(' ');
    tiddler.type = $(selector + ' .tiddler-type').val();
};

SPA.prototype.setFilteredLists = function() {
    this.filteredLists.all = new Filter(this.space.getLists().all);
    this.filteredLists.modified = new Filter(this.space.getLists().modified);
    this.filteredLists.tags = new Filter(this.space.getLists().tags, true);
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
        context.renderNavigationList('private', context.html.generateTiddlersList, context.space.getLists()['private']);
        if (callBack) {
            callBack();
        }
    };
    this.space.getPrivateTiddlers(success, this.ajaxError);
};

SPA.prototype.filter = function(text) {
    var list = $('input:radio[name=searchType]:checked').val();
    var filtered = this.filteredLists[list].filter('title', text);
    this.renderNavigationList(list, this._getListTemplate(list), filtered);    
};

SPA.prototype.switchList = function(name) {
    $('.navigation-list').hide();
    $('.navigation-list-' + name).show();
};

SPA.prototype.addToLists = function(tiddler) {
    //TODO - add to different lists
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
    this.renderNavigationList('modified', this.html.generateTiddlersList, this.space.getLists().modified);
    this.renderNavigationList('all', this.html.generateTiddlersList, this.space.getLists().all);
    this.renderNavigationList('tags', this.html.generateTagsList, this.space.getLists().tags);    
};

SPA.prototype.renderNavigationList = function(name, renderer, data) {
    var selector = 'nav .navigation-list-' + name;
    $(selector).replaceWith(renderer.call(this.html, { name: name, items: data }));
};

SPA.prototype._getListTemplate = function(name) {
    var generators = {
        tags: this.html.generateTagsList
    };
    var generator = generators[name];
    return typeof generator === "undefined" ? this.html.generateTiddlersList : generator;
};

SPA.prototype.toggleMenu = function(tiddlers) {
    if ($('nav').hasClass('visible')) {
        this.closeMenu();
    } else {
        this.openMenu();        
    }
};

SPA.prototype.openMenu = function(tiddlers) {
    $('nav').addClass('visible');
};

SPA.prototype.closeMenu = function(tiddlers) {
    $('nav').removeClass('visible');
};

SPA.prototype.openTag = function(tag) {
    $.growl.warning({ title: 'Coming soon...',  message: "Opening tags isn't implemented yet" });
};

SPA.prototype._getSelector = function(title) {
    return "section[data-title='" + title + "']";
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
