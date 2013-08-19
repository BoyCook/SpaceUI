
function Filter(data, operation) {
	this.data = data;
	this.operation = operation;
	// this.data.splice(0, 1)
}

Filter.prototype.filter = function(key, value) {
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
