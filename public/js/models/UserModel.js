define(function () {
    var UserModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults:{
            ulogin:"",
            uemail:"",
            upass:"",
            profile:{
                company:{
                    id:"",
                    name:""
                },
                profile:{
                    id:"",
                    name:""
                }
            }
        },
        validate: function(attrs, options){
            if(attrs.upass != options.confirmPass)
            {
                alert('Passwords do not match!');
                return false;
            }
        },
        urlRoot: function(){
            return "/Users";
        }

    });

    return UserModel;
});