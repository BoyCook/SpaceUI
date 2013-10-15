
function HTTP() {
    this.contentType = 'application/json';
    this.dataType = 'json';
}

HTTP.prototype.doGet = function(url, success, error) {
    this.doAjax(url, 'GET', this.contentType, this.dataType, undefined, success, error);
};

HTTP.prototype.doPut = function(url, data, success, error) {
    this.doAjax(url, 'PUT', this.contentType, this.dataType, data, success, error);
};

HTTP.prototype.doPost = function(url, data, success, error) {
    this.doAjax(url, 'POST', this.contentType, this.dataType, data, success, error);
};

HTTP.prototype.doDelete = function(url, success, error) {
    this.doAjax(url, 'DELETE', this.contentType, this.dataType, undefined, success, error);
};

HTTP.prototype.doAjax = function(url, method, contentType, dataType, data, success, error) {
    var config = {
        url: url,
        type: method, 
        success: function(data, status, xhr) {
            success(data);
        },
        error: function(xhr, err, exc) {
            error(xhr, err, exc);
        }
    };
    if (contentType) {
        config.contentType = contentType;
    }
    if (dataType) {
        config.dataType = dataType;
    }
    if (data) {
        config.data = JSON.stringify(data);
    }
    $.ajax(config);     
};

if (!(typeof exports === "undefined")) {
    exports.HTTP = HTTP;
}
