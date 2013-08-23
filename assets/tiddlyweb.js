
function TiddlyWeb(baseURL) {
	this.baseURL = baseURL;
	this.bags = undefined;
	this.recipes = undefined;
	this.http = new HTTP();
	//TODO - also check refresh index
	//TODO - better undefined check 
	// /bags/tiddlers
	// /bags/tiddlers/revision
	// /recipes/tiddlers
	// /recipes/tiddlers/revision	

	/*
		get* gets from local cache
		load*

	*/

}

TiddlyWeb.prototype._init = function() {
	this.loadBags();
	this.loadRecipes();
};

TiddlyWeb.prototype.getBags = function() {
	return this.bags;
};

TiddlyWeb.prototype.loadBags = function(success, error) {
	if (this.getBags() === "undefined") {
		this._loadBags('', success, error);
	} else {
		success(this.bags);
	}
};

TiddlyWeb.prototype._loadBags = function(params, success, error) {
	//TODO: manage cache
	this.http.doGet(this.baseURL + '/bags' + params, success, error);
};

TiddlyWeb.prototype.getBag = function(name) {
	return this.bags[name];
};

TiddlyWeb.prototype.loadBag = function(name, success, error) {
	var bag = this.getBags(name);
	if (bag === "undefined") {
		this._loadBag(name, success, error);
	} else {
		success(bag);
	}
};

TiddlyWeb.prototype._loadBag = function(name, params, success, error) {
	//TODO: manage cache
	this.http.doGet(this.baseURL + '/bags/' + name + params, success, error);
};

TiddlyWeb.prototype._loadBagTiddlers = function(name, params, success, error) {
	this.http.doGet(this.baseURL + '/bags/' + name + '/tiddlers' +  params, success, error);
};

TiddlyWeb.prototype.getRecipes = function() {
	return this.recipes();
};

TiddlyWeb.prototype.loadRecipes = function(success, error) {
	if (this.getRecipes() === "undefined") {
		this._loadRecipes('', success, error);
	} else {
		success(this.recipes);
	}
};

TiddlyWeb.prototype._loadRecipes = function(params, success, error) {
	//TODO: manage cache
	this.http.doGet(this.baseURL + '/recipes' + params, success, error);
};

TiddlyWeb.prototype.loadRecipe = function(name) {
	return this.recipes[name];	
};

TiddlyWeb.prototype.loadRecipe = function(name, success, error) {
	var recipe = this.getRecipes(name);
	if (recipe === "undefined") {
		this._loadRecipe(name, success, error);
	} else {
		success(recipe);
	}
};

TiddlyWeb.prototype._loadRecipe = function(name, params, success, error) {
	//TODO: manage cache
	this.http.doGet(this.baseURL + '/recipes/' + name + params, success, error);
};

function Bag(json) {
	this.name = json.name;
	this.tiddlers = [];
	this.json = json;
}

Bag.prototype.get = function(key) {
	return this.json[key]
};

Bag.prototype.getName = function() {
	return this.get('name');
};

Bag.prototype.getTiddlers = function() {
	return this.tiddlers;
};

Bag.prototype.getTiddler = function(title) {
	for (var i=0,len=this.tiddlers.length; i < len; i++) {
		var tiddler = this.tiddlers[i];
		if (tiddler.title == title) {
			return tiddler;
		}
	}
	return undefined;
};

var tw = new TiddlyWeb('domain');
tw.getBags();
