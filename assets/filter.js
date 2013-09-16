
function Filter(data, isString) {
	this.data = data;
	this.text = '';
	if (isString) {
		this.filter = this.filterString;		
	} else {
		this.filter = this.filterObject;		
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

function SortedFilter(data, isString, by) {
	this.sort = new Sort(data);
	Filter.call(this, this.sort.sort(by), isString);
}

SortedFilter.prototype = new Filter();
SortedFilter.prototype.constructor = SortedFilter;
// SortedFilter.prototype.count = function() {
//     this.countDown();
// };


