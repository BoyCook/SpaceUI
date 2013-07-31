
function HTTP() {
}

HTTP.prototype.doGet = function(url, success, error) {
    t§is.doAjax(url, 'GET', undefined, success, error);
};

HTTP.prototype.doPut = function(url, data, success, error) {
    this.doAjax(url, 'PUT', data, success, error);
};

HTTP.prototype.doPost = function(url, data, success, error) {
    this.doAjax(url, 'POST', data, success, error);
};

HTTP.prototype.doDelete = function(url, success, error) {
    this.doAjax(url, 'DELETE', undefined, success, error);
};

HTTP.prototype.doAjax = function(url, method, data, success, error) {
    var config = {
        url: url,
        type: method,
        contentType: 'application/json',
        dataType: 'json',        
        success: function(data, status, xhr) {
            success(data);
        },
        error: function(xhr, err, exc) {
            error(xhr, err, exc);
        }
    };
    if (data) {
        config.data = JSON.stringify(data);
    }
    $.ajax(config);     
}
