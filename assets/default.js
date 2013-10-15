var app;
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
    menu: function() {
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
        var router = new Router();
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
