
function HTML(tag, value, attributes) {
	this.tag = tag;
	this.value = value;
	this.attributes = attributes;
	this.children = [];
}

HTML.prototype.append = function(child) {
	this.children.push(child);
};

HTML.prototype.asHTML = function() {
	var isSingle = this.isSingleNode();
	if (isSingle) {
		return this.getSingleTag();
	} else {
		return this.getStartTag() + this.getValue() + this.getEndTag();
	}
};

HTML.prototype.getSingleTag = function() {
	return "<" + this.tag + this.getAttributes() + "/>";		
};
   
HTML.prototype.getStartTag = function() {
	return "<" + this.tag + this.getAttributes() + ">";		
};

HTML.prototype.getEndTag = function() {
    return "</" + this.tag + ">";
};

HTML.prototype.isSingleNode = function() {
	return (this.children.length == 0 && typeof this.value === "undefined");
};

HTML.prototype.getAttributes = function() {
	var value = '';
	for (var key in this.attributes) {
		if (this.attributes.hasOwnProperty(key)) {
			value += ' ' + key + "=\"" + this.attributes[key] + "\"";
		}
	}
	return value;
};

HTML.prototype.getValue = function() {
	var value = '';
	if (typeof this.value !== "undefined") {
		value += this.value;
	} else {
		value += this.getChildren();
	}
    return value;
};

HTML.prototype.getChildren = function() {
	var value = '';
	for (i in this.children) {
		value += this.children[i].asHTML();
	}
    return value;
};
