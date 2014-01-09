function SPA(host, port) {
    this.baseURL = "http://" + host + ':' + port;  
    if (host === 'localhost') {
        this.spaceName = 'spaceui';
    } else if (host.indexOf('.') > 0) {
        this.spaceName = host.substring(0, host.indexOf('.'));
    } else {
        this.spaceName = host;
    }
	this.html = new HTMLGenerator(this.spaceName);
    this.space = new Space(this.baseURL, this.spaceName, this);
    this.maximized = false;
    this.filteredLists = {
        all: {
            filter: new Filter([]),
            renderer: this.html.generateTiddlersList
        },
        modified: {
            filter: new Filter([]),
            renderer: this.html.generateTiddlersList
        },
        private: {
            filter: new Filter([]),
            renderer: this.html.generateTiddlersList
        },
        tags: {
            filter: new Filter([]),
            renderer: this.html.generateTagsList
        },
        loaded: {
            filter: new Filter([]),
            renderer: this.html.generateTiddlersList
        },
        cached: {
            filter: new Filter([]),
            renderer: this.html.generateTiddlersList
        }
    };    
}

SPA.prototype.setup = function(callBack) {
    var context = this;
    var done = function(){
        context._loadSiteTitle();
        context._loadDefaults(callBack);
        context.switchList('modified');
    };
    this.getPublicTiddlers(done); 
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
            }, context.silentError);                    
    }, context.silentError);        
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
            if (index === loader.titles.length) {
                return;
            }
            var next = function(tiddler) {
                context._tiddlerLoaded(tiddler);
                loader.cnt++;
                //It's done
                if (loader.cnt === loader.titles.length && loader.callBack) {
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
            new Loader(items, callBack).execute();
    }, function(xhr, error, exc) {
        var defaultText = 'There was an unknown error - check your connectivity';
        var text = (xhr.responseText !== '' ? xhr.responseText : (xhr.statusText !== '' ? xhr.statusText : defaultText));
        var msg = 'ERROR (' + xhr.status + ') [' + text + ']';    
        console.log(msg);    
        if (callBack) {
            callBack();
        }
    });        
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
    var summary = this.space.getSummaryTiddler(title);
    var tiddler = this.space.getTiddler(title);
    if (typeof summary !== "undefined") {
        var tiddler = this.space.getTiddler(summary.title);
        var fetch = this.isDoFetch(summary, tiddler);
        if (fetch === true) {
            this.space.fetchTiddler(summary, this._tiddlerLoaded, this.ajaxError);        
        } else {
            if ($(this._getSelector(summary.title)).length === 0) {
                this.renderTiddler(typeof tiddler !== "undefined" ? tiddler : summary); 
                this._fixTiddlerTextURLs(tiddler);    
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
    this._fixTiddlerTextURLs(tiddler);    
};

SPA.prototype._setLoadedCache = function(tiddler) {
    this.filteredLists.loaded.filter.data.push(tiddler);
    this.renderNavigationList('loaded');
};

SPA.prototype._setTiddlerDate = function(tiddler) {
    tiddler.displaydate = new DateAgo(new Date(), this._parseDate(tiddler.modified)).get();    
};

SPA.prototype._fixTiddlerTextURLs = function(tiddler) {
    $("section[data-title='" + tiddler.title + "'] article a").each(function(){
        var href = $(this).attr('href');
        if (href.indexOf('http') === 0) {
            $(this).attr('target', '_blank');
        } else {
            $(this).attr('href', '#' + href);
        }
    });
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
            break;
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
};

SPA.prototype.newTiddler = function(title) {
    var selector = this._getSelector(title);
    var summary = this.getTiddlerJSON(title);
    var tiddler = this.space.getTiddler(summary.title);
    if (typeof tiddler === "undefined") {
        //If box isn't already open
        if ($(selector).length === 0) {
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
    var selector = this._getSelector(tiddler.title);
    this._readTiddlerForm(selector, tiddler);
    tiddler.bag = this.spaceName + '_' + $(selector + ' input[name=privacy]:checked').val();
    this.space.saveTiddler(tiddler, this.addedTiddler, this.ajaxError);
};

SPA.prototype.updateTiddler = function(tiddler) {
    var selector = this._getSelector(tiddler.title);
    this._readTiddlerForm(selector, tiddler);
    //TODO: can a tiddler switch between public/private (or is it delete/copy)
    var callBack = this.updatedTiddler;
    if (tiddler.title !== tiddler.originalTitle) {
        callBack = this.renamedTiddler;
    }
    this.space.saveTiddler(tiddler, callBack, this.ajaxError);
};

SPA.prototype.deleteTiddler = function(title) {
    var tiddler = this.space.getTiddler(title);
    tiddler.type = 'application/json';
    this.space.deleteTiddler(tiddler, this.removedTiddler, this.ajaxError);
};

SPA.prototype.addedTiddler = function(tiddler) {
    $.growl.notice({ title: 'Success',  message: 'Added tiddler ' + tiddler.title });
    $(this._getSelector(tiddler.title)).remove();
    this.refreshLists();
    this.closeTiddler(tiddler.originalTitle);
    this.openTiddler(tiddler.title);    
};

SPA.prototype.updatedTiddler = function(tiddler) {
    $.growl.notice({ title: 'Success',  message: 'Updated tiddler ' + tiddler.title });
    $("section[data-title='" + tiddler.originalTitle + "']").remove();
    this.refreshLists();
    this.space.removeTiddler(tiddler.originalTitle);
    this.closeTiddler(tiddler.originalTitle);
    this.openTiddler(tiddler.title);
};

SPA.prototype.renamedTiddler = function(tiddler) {
    $.growl.notice({ title: 'Success',  message: 'Updated tiddler ' + tiddler.title });
    $("section[data-title='" + tiddler.originalTitle + "']").remove();
    this.openTiddler(tiddler.title);
    // this.deleteTiddler(tiddler.originalTitle);
    // tiddler.type = 'application/json';
    var del = { 
        title: tiddler.originalTitle,
        bag: tiddler.bag,
        type: 'application/json'
    };
    this.space.deleteTiddler(del, this.removedTiddler, this.ajaxError);    
};

SPA.prototype.removedTiddler = function(tiddler) {
    $.growl.notice({ title: 'Success', message: 'Deleted tiddler ' + tiddler.title });
    $("section[data-title='" + tiddler.title + "']").remove();
    this.refreshLists();
};

SPA.prototype._readTiddlerForm = function(selector, tiddler) {
    tiddler.originalTitle = tiddler.title;
    tiddler.title = $(selector + ' .tiddler-title').val();
    tiddler.text = $(selector + ' .tiddler-text').val();
    tiddler.tags = $(selector + ' .tiddler-tags').val().split(' ');
    tiddler.type = $(selector + ' .tiddler-type').val();
};

SPA.prototype.getPublicTiddlers = function(callBack) {
    var context = this; 
    var success = function(data) {
        context.setPublicFilteredLists();
        context.renderPublicNavigationLists();
        if (callBack) {
            callBack();
        }
    };
    this.space.getPublicTiddlers(success, this.ajaxError);
};

SPA.prototype.getPrivateTiddlers = function(callBack) {
    // http://boycook.tiddlyspace.com/bags/boycook_private/tiddlers
    var context = this; 
    var success = function(data) {
        context.setPrivateFilterList();
        context.renderPrivateNavigationList();
        if (callBack) {
            callBack();
        }
    };
    this.space.getPrivateTiddlers(success, this.silentError);
};

SPA.prototype.filter = function(text) {
    var list = $('input:radio[name=searchType]:checked').val();
    var filtered = this.filteredLists[list].filter.filter('title', text);
    this.renderNavigationListWithData(list, filtered);
};

SPA.prototype.switchList = function(name) {
    $('.navigation-list').hide();
    $('.navigation-list-' + name).show();
};

SPA.prototype.refreshLists = function() {
    this.setFilteredLists();
    this.renderNavigationLists();
};

SPA.prototype.setFilteredLists = function() {
    this.setPublicFilteredLists();
    this.setPrivateFilterList();
};

SPA.prototype.setPublicFilteredLists = function() {
    var sort = new Sort(this.space.lists.tiddlers.public);
    this.filteredLists.all.filter = new Filter(sort.sort('title'));
    this.filteredLists.modified.filter = new Filter(sort.sort('-modified'));
    this.filteredLists.tags.filter = new Filter(this.space.lists.tags, true);
};

SPA.prototype.setPrivateFilterList = function() {
    var sort = new Sort(this.space.lists.tiddlers.private);
    this.filteredLists.private.filter = new Filter(sort.sort('title'));
};

SPA.prototype.renderNavigationLists = function() {
    for (var key in this.filteredLists) {
        if (this.filteredLists.hasOwnProperty(key)) {
            this.renderNavigationList(key);
        }
    }
};

SPA.prototype.renderPublicNavigationLists = function() {
    this.renderNavigationList('modified');
    this.renderNavigationList('all');
    this.renderNavigationList('tags');
};

SPA.prototype.renderPrivateNavigationList = function() {
    this.renderNavigationList('private');
};

SPA.prototype.renderNavigationList = function(name) {
    var list = this.filteredLists[name];
    this._renderNavigationList(name, list.renderer, list.filter.data);
};

SPA.prototype.renderNavigationListWithData = function(name, data) {
    this._renderNavigationList(name, this.filteredLists[name].renderer, data);
};

SPA.prototype._renderNavigationList = function(name, renderer, data) {
    var selector = 'nav .navigation-list-' + name;
    $(selector).html(renderer.call(this.html, { name: name, items: data }));
};

SPA.prototype.toggleMenu = function() {
    this.clearAnchor();
    if ($('nav').hasClass('visible')) {
        this.closeMenu();
    } else {
        this.openMenu();        
    }
};

SPA.prototype.openMenu = function() {
    $('nav').addClass('visible');
};

SPA.prototype.closeMenu = function() {
    $('nav').removeClass('visible');
};

SPA.prototype.openTag = function(tag) {
    var context = this;
    var success = function(data) {
        for (var i=0,len=data.length; i<len; i++) {
            context.openTiddler(data[i].title);
        }
    };
    this.space.getTiddlersWithTag(tag, success, this.ajaxError);
};

SPA.prototype._getSelector = function(title) {
    return "section[data-title='" + title + "']";
};

SPA.prototype.renderTiddler = function(tiddler) {
   $('#content').prepend(this.html.generateViewTiddler(tiddler));	
};

SPA.prototype.clearAnchor = function() {
    document.location.href = '#';
};

SPA.prototype.silentError = function(xhr, error, exc) {
    document.location.href = '#';
    var defaultText = 'There was an unknown error - check your connectivity';
    var text = (xhr.responseText !== '' ? xhr.responseText : (xhr.statusText !== '' ? xhr.statusText : defaultText));
    var msg = 'ERROR (' + xhr.status + ') [' + text + ']';    
    console.log(msg);
};

SPA.prototype.ajaxError = function(xhr, error, exc) {
    document.location.href = '#';
    var defaultText = 'There was an unknown error - check your connectivity';
    var text = (xhr.responseText !== '' ? xhr.responseText : (xhr.statusText !== '' ? xhr.statusText : defaultText));
    var msg = 'ERROR (' + xhr.status + ') [' + text + ']';
    console.log(msg);
    $.growl.error({ message: msg });
};

if (!(typeof exports === "undefined")) {
    exports.SPA = SPA;
}
