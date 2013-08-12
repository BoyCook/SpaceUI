
function HTTP() {
}

HTTP.prototype.doGet = function(url, success, error) {
    this.doAjax(url, 'GET', 'application/json', 'json', undefined, success, error);
};

HTTP.prototype.doPut = function(url, contentType, dataType, data, success, error) {
    this.doAjax(url, 'PUT', contentType, dataType, data, success, error);
};

HTTP.prototype.doPost = function(url, contentType, dataType, data, success, error) {
    this.doAjax(url, 'POST', contentType, dataType, data, success, error);
};

HTTP.prototype.doDelete = function(url, contentType, dataType, success, error) {
    this.doAjax(url, 'DELETE', contentType, dataType, undefined, success, error);
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
}
