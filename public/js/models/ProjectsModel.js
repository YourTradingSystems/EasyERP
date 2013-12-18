define(['Validation'],
    function (Validation) {
    var ProjectModel = Backbone.Model.extend({
        idAttribute: "_id",

        initialize: function(){
            this.on('invalid', function(model, errors){
                if(errors.length > 0){
                    var msg = errors.join('\n');
                    alert(msg);
                }
            });
        },

        validate: function(attrs){
            var errors = [];

            Validation.checkNameField(errors, true, attrs.projectName, "Project name");
            Validation.checkNameField(errors, true, attrs.projectShortDesc, "Short description");

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