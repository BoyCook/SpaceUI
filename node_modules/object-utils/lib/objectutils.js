
function isUndefined(val) {
    return typeof val === "undefined";
}

function isDefined(val) {
    return !isUndefined(val);
}

function isNotEmpty(val) {
    return (isDefined(val) && val.length > 0);
}

function isEmpty(val) {
    return !isNotEmpty(val);
}

function isNotObject(o) {
	return !isObject(o);
}

function isObject(o) {
	return typeof o === "object";
}

exports.isDefined = isDefined;
exports.isUndefined = isUndefined;

exports.isEmpty = isEmpty;
exports.isNotEmpty = isNotEmpty;

exports.isObject = isObject;
exports.isNotObject = isNotObject;

exports.getDateString = function() {
    var date = Date.now();
    return date.getFullYear() + '-' +
        date.getMonth() + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes();
};
