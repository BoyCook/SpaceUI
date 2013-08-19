
function Sort(data) {
	this.data = data;
}

Sort.prototype.sort = function(key, desc) {
	return this.data.sort(function(a,b) {
		if (a[key] > b[key]) {
			return desc ? 1 : -1;
		} else if (a[key] < b[key]) {
			return desc ? -1 : 1;
		}
		return 0;
	});
};
