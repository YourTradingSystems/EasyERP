define(function () {
    var ProjectModel = Backbone.Model.extend({
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

            if(attrs.projectName === ""){
                errors.push(
                    {
                        name:"Project",
                        field:"projectName",
                        msg:"Project name can not be empty"
                    }
                );
            }
            if(attrs.projectShortDesc === ""){
                errors.push(
                    {
                        name: "Project",
                        field: "projectName",
                        msg: "Project description can not be empty"
                    }
                );
            }

            if(errors.length > 0)
                return errors;
        },
        defaults: {
            projectName: '',
            projectShortDesc: '',
            task: [],
            privacy: 'All Users',
            customer: '',
            projectmanager: '',
            teams: {
                users: [],
                Teams: []
            },
            info: {
                StartDate: null,
                duration: 0,
                EndDate:  null,
                sequence: 0 ,
                parent: null
            },
            estimated: 0,
            logged: 0,
            remaining: 0,
            progress: 0
        },

        urlRoot: function () {
            return "/Projects";
        }
    });

    return ProjectModel;
});