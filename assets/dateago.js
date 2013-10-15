var DateAgo = function (d1, d2) {
    this.units = {
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2592000000,
        year: 31536000000
    };

    this.d1 = d1;
    this.d2 = d2;
    return this;
};

DateAgo.prototype.get = function() {
    var diff = (this.d1 - this.d2);

    if (diff < 45000) { // < 35 seconds
        return "Just now";
    } else if (diff < 75000) { // < 75 seconds
        return "About a minute ago";
    } else if (diff < this.units.hour) {
        return Math.round(diff / this.units.minute) + " minutes ago";
    } else if (diff < this.units.day) {
        return this.calculate("hour", this.units.hour, "minute", this.units.minute, diff);
    } else if (diff < this.units.week) {
        return this.calculate("day", this.units.day, "hour", this.units.hour, diff);
    } else if (diff < this.units.year) { // < 1 year (1000*60*60*24*52)
        return this.calculate("week", this.units.week, "day", this.units.day, diff);
    } else if (diff > this.units.year) { // > 1 year (1000*60*60*24*52)
        return this.calculate("year", this.units.year, "month", this.units.month, diff);
    }
    return diff + " ms ago";
};

DateAgo.prototype.calculate = function(unitName, unit, lowerUnitName, lowerUnit, diff) {
    var upperDiff = Math.floor(diff / unit);
    var remainder = Math.round(diff % unit);
    var lowerDiff = Math.floor(remainder / lowerUnit);
    if (remainder >= 1 && lowerDiff >= 1) {
        return this.getText(upperDiff, unitName) + " and " + this.getText(lowerDiff, lowerUnitName) + " ago";
    } else {
        return this.getText(Math.round(diff / unit), unitName) + " ago";
    }
};

DateAgo.prototype.getText = function(value, name) {
    return value + " " + (value > 1 ? (name + "s") : name);
};

