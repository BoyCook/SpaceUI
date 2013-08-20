
function Sort(data) {
	this.data = data;
}

Sort.prototype.sort = function(key) {
	var asc = true;
	if (key.indexOf('-') == 0) {
		key = key.substring(1);
		asc = false;
	}
	//Clone input for multiple use
	var data = this.data.slice(0);
	return data.sort(function(a,b) {
		if (a[key] > b[key]) {
			return asc ? 1 : -1;
		} else if (a[key] < b[key]) {
			return asc ? -1 : 1;
		}
		return 0;
	});
};
