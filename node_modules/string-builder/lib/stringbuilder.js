/*
    StringBuilder implementation
 */

function StringBuilder(useArray) {
    if (useArray) {
        this.items = [];
        this.append = this.appendArray;
        this.toString = this.toStringArray;
    } else {
        this.text = '';
        this.append = this.appendString;
        this.toString = this.toStringString;
    }
}

StringBuilder.prototype.appendString = function (text) {
    this.text += text;
};

StringBuilder.prototype.appendArray = function (text) {
    this.items.push(text);
};

StringBuilder.prototype.toStringString = function () {
    return this.text;
};

StringBuilder.prototype.toStringArray = function () {
    return this.items.join('');
};

exports.StringBuilder = StringBuilder;
