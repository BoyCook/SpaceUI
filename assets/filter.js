
function Filter(data, operation, key) {
	this.data = data;
	this.operation = operation;
	// this.data.splice(0, 1)
	this.text = '';
	var context = this;
	if (typeof this.data[0] === "object") {
		this.filter = this.filterObject;
	} else {
		this.filter = this.filterString;		
	}
}

Filter.prototype.filterString = function(key, value) {
	this.text = value;
	value = value.toLowerCase();
	var filtered = [];
	for (var i=0,len=this.data.length; i<len; i++) {
		var item = this.data[i];
		if (item.toLowerCase().indexOf(value) > -1) {
			filtered.push(item);
		}
	}
	return filtered;	
};

Filter.prototype.filterObject = function(key, value) {
	this.text = value;
	value = value.toLowerCase();
	var filtered = [];
	for (var i=0,len=this.data.length; i<len; i++) {
		var item = this.data[i];
		if (item.hasOwnProperty(key) && item[key].toLowerCase().indexOf(value) > -1) {
			filtered.push(item);
		}
	}
	return filtered;
};
