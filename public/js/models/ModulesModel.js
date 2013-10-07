define(function(){
 
    var ModulesModel = Backbone.Model.extend({

        urlRoot: 'http://192.168.88.109:8088/getModules',

        parse: true,

        defauls: {
            mid: '',
            mname: '',
            content: []
        },

        parse: function(resp){
            if(resp.result.status == "0"){
                return {
                    mid: resp.data[0].mid,
                    mname: resp.data[0].mname,
                    content: resp.data[0].content
                };
                /*resp.data.forEach(function(item){
                   return {
                       mid: item.mid,
                       mname: item.mname,
                       content: item.content
                   }
                });*/
            }
        }

    });

    return ModulesModel;

});