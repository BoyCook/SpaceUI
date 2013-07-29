
function HTML(tag, value, attributes) {
	this.tag = tag;
	this.value = value;
	this.attributes = attributes;
	this.children = [];
}

HTML.prototype.append = function(child) {
	this.children.push(child);
}

HTML.prototype.render = function() {
	return this.getStartTag() + this.getValue() + this.getEndTag();
}
   
HTML.prototype.getStartTag = function() {
	if (typeof this.attributes === "undefined") {
		return "<" + this.tag + ">";
	} else {
		return "<" + this.tag + this.getAttributes() + ">";		
	}
}

HTML.prototype.getEndTag = function() {
    return "</" + this.tag + ">";
}

HTML.prototype.getAttributes = function() {
	var value = ' ';
	for (var key in this.attributes) {
		if (this.attributes.hasOwnProperty(key)) {
			value += key + "=\"" + this.attributes[key] + "\"";
		}
	}
	return value;
}

HTML.prototype.getValue = function() {
	var value = '';
	if (typeof this.value !== "undefined") {
		value += this.value;
	} else {
		for (i in this.children) {
			value += this.children[i].render();
		}
	}
    return value;
}
