define(function () {
    var getData = function(url, data, callback){
        $.get(url, data, function(response){
            callback(response);
        });
    }
    return {
        getData:getData
    }

});
