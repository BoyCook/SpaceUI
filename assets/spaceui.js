var app = undefined;

$(document).ready(function () {
    app = new SPA("http://" + window.location.hostname + ':' + window.location.port);
});

function SPA(host) {
    this.host = host;
	this.currentSpace = host.substring(host.indexOf('://') + 3, host.indexOf('.'));
	this.bagName = 'spaceui_public'; //TODO calculate bag name
	this.html = new HTML();
	this.spaces = undefined;
	//TODO: do something with this data - i.e. provide client filter
	this.loadRecent();    
}

SPA.prototype.loadRecent = function() {
	var context = this;	
	var success = function(data) {
		var tiddlerText = '';
		for (var i=0,len=data.length;i<len;i++) {
			tiddlerText += context.html.generateTiddlerList(data[i]);
		}
		context.renderTiddlers(tiddlerText);
	};
	
	var error = function(error) {
		alert(error);
	};

	
	this.load(this.host + '/bags/spaceui_public/tiddlers?sort=-modified;limit=10', success, error);
}

SPA.prototype.loadTiddler = function(title) {
	var context = this;	
	var success = function(data) {
		context.renderTiddler(context.html.generateTiddler(data));
	};
	
	var error = function(error) {
		alert(error);
	};

	this.load(this.host + '/bags/' + this.bagName + '/tiddlers/' + title, success, error);
}

SPA.prototype.renderTiddlers = function(html) {
   $('.nav').html(html);	
}

SPA.prototype.renderTiddler = function(html) {
   $('#content').append(html);	
}

SPA.prototype.putTiddler = function(url, data, success, error) {
    $.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),        
        success: function(data, status, xhr) {
            success(data);
        },
        error: function(xhr, error, exc) {
            error(error);
        }
    });	
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
            error(error);
        }
    });	
}
