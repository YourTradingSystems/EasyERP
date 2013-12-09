define(function () {
    var departmentModel = Backbone.Model.extend({
        idAttribute: "_id",
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

        validate: function(attrs){
            var errors = [];

            if($.trim(attrs.departmentName) == ""){
                errors.push(
                    {
                        name:"Department",
                        field:"departmentName",
                        msg:"Department name can not be empty"
                    }
                );
            }
            if(errors.length > 0)
                return errors;
        },

        defaults: {
            departmentName: 'emptyDepartment',
            parentDepartment:"", 
            departmentManager: ""
        },

        urlRoot: function () {
            return "/Departments";
        }
    });

    return departmentModel;
});
