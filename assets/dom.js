
function DOM(tag, value, attributes) {
	this.tag = tag;
	this.value = value;
	this.attributes = attributes;
	this.children = [];
}

DOM.prototype.append = function(child) {
	this.children.push(child);
}

DOM.prototype.render = function() {
	return this.getStartTag() + this.getValue() + this.getEndTag();
}
   
DOM.prototype.getStartTag = function() {
	if (typeof this.attributes === "undefined") {
		return "<" + this.tag + ">";
	} else {
		return "<" + this.tag + this.getAttributes() + ">";		
	}
}

DOM.prototype.getEndTag = function() {
    return "</" + this.tag + ">";
}

DOM.prototype.getAttributes = function() {
	var value = ' ';
	for (var key in this.attributes) {
		if (this.attributes.hasOwnProperty(key)) {
			value += key + "=\"" + this.attributes[key] + "\"";
		}
	}
	return value;
}

DOM.prototype.getValue = function() {
	// var value = '';
	// if (typeof this.value !== "undefined") {
	// 	value += this.value;
	// } else {
	// 	for (var i=0,len<this.children.length; i<len; i++) {
	// 		value += this.children[i].render();
	// 	}	
	// }
    return this.value;
}
