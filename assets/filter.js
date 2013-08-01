
function Filter(data, operation) {
	this.data = data;
	this.operation = operation;
}

Filter.prototype.filter = function(key, value) {
	var filtered = [];
	for (var i=0,len=this.data.length; i<len; i++) {
		var item = this.data[i];
		if (item.hasOwnProperty(key) && item[key].indexOf(value) > -1) {
			filtered.push(item);
		}
	}
	return filtered;
};
