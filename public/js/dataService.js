define(function () {
    var getData = function(url, data, callback, context){
        $.get(url, data, function(response){
            if (context) {
                callback(response, context);
            } else callback(response);
        });
    }
    var postData = function(url, data, callback){
        $.post(url, data,function(resp){
            callback(resp);
        });
    }
    return {
        getData:getData,
        postData:postData
    }

});
