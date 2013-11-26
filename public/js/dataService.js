define(function () {
    var getData = function(url, data, callback){
        $.get(url, data, function(response){
            callback(response);
        });
    }
    var postData = function(url, data,callback){
        $.post(url, data,function(resp){
            callback(resp);
        });
    }
    return {
        getData:getData,
        postData:postData
    }

});
