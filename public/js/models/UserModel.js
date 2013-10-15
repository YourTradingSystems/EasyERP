define(function () {
    var UserModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults:{
            login:"",
            email:"",
            pass:"",
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
        initialize: function(){
            this.on('invalid', function(model, errors){
                if(errors.length > 0){
                    var msg = $.map(errors,function(error){
                        return error.msg;
                    }).join('\n');
                    alert(msg);
                }
            });
        },

        validate: function(attrs, options){
            var errors = [];

            if(attrs.login.trim() == ""){
                errors.push(
                    {
                        name:"Login",
                        field:"login",
                        msg:"Login can not be empty"
                    }
                );
            }
            if(attrs.pass.trim() == ""){
                errors.push(
                    {
                        name:"Password",
                        field:"pass",
                        msg:"Password can not be empty"
                    }
                );
            }
            if(options.confirmPass.trim() == ""){
                errors.push(
                    {
                        name:"Confirmation password",
                        field:"confirmPass",
                        msg:"Confirmation password can not be empty"
                    }
                );
            }
            if(attrs.pass != options.confirmPass){
                errors.push(
                    {
                        name:"",
                        field:"",
                        msg:"Password and confirm password do not match"
                    }
                );
            }
            if(attrs.email.trim() == ""){
                errors.push(
                    {
                        name:"Email",
                        field:"email",
                        msg:"Email can not be empty"
                    }
                );
            }
            if(errors.length > 0)
                return errors;
        },
        urlRoot: function(){
            return "/Users";
        }

    });

    return UserModel;
});