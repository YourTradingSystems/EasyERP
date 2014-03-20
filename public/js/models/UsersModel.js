define(['Validation'],function (Validation) {
    var UserModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            imageSrc: "",
            login:"",
            email:"",
            profile:null,
            RelatedEmployee:null
        },
        initialize: function(){
            this.on('invalid', function(model, errors){
                if(errors.length > 0){
                    var msg = errors.join('\n');
                    alert(msg);
                }
            });
        },

        validate: function(attrs, options){
            var errors = [];
	            Validation.checkLoginField(errors, true, attrs.login, "Login");
	            Validation.checkEmailField(errors, false, attrs.email, "Email");
                if (attrs.login) Validation.checkLoginField(errors, true, attrs.login, "Login");
                if (attrs.pass)Validation.checkPasswordField(errors, true, attrs.pass, "Password");
                if (attrs.confirmPass) Validation.checkPasswordField(errors, true, options.confirmPass, "Confirm password");
                Validation.comparePasswords(errors, attrs.pass, options.confirmPass);
            if(errors.length > 0)
                return errors;
        },
        urlRoot: function(){
            return "/Users";
        }

    });

    return UserModel;
});