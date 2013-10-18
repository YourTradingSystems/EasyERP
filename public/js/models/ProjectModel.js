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

            if(attrs.projectName.trim() == ""){
                errors.push(
                    {
                        name:"Project",
                        field:"projectName",
                        msg:"Project name can not be empty"
                    }
                );
            }
            if(errors.length > 0)
                return errors;
        },
        defaults: {
            projectName: '',
            projectShortDesc: '',
            task: {
                avaliable: false,
                tasks: []
            },
            privacy: 'All Users',
            customer: {
                id: '',
                type: '',
                name: ''
            },
            projectmanager: {
                id: '',
                name: ''
            },
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
            workflow: {
                name: 'New',
                status: 'New'
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