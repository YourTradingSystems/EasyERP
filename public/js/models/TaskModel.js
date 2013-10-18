define(function () {
    var TaskModel = Backbone.Model.extend({
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
            if(attrs.summary.trim() == ""){
                errors.push(
                    {
                        name:"Summary",
                        field:"summary",
                        msg:"Summary name can not be empty"
                    }
                );
            }
            if(errors.length > 0)
                return errors;
        },
        defaults: {
            summary: '',
            project: {
                id: '',
                name: ''
            },
            assignedTo: {
                id: '',
                name: ''
            },
            deadline: null,
            tags: [],
            description: '',
            extrainfo: {
                priority: 'Medium',
                duration: null,
                sequence: 0,
                customer: {
                    id: '',
                    name: ''
                },
                StartDate: null,
                EndDate: null
            },
            workflow: {
                name: 'Analysis',
                status: 'New'
            },
            color: '#4d5a75',
            estimated: 0,
            logged: 0,
            remaining: 0,
            progress: 0
        },

        urlRoot: function () {
            return "/Tasks";
        }
    });

    return TaskModel;
});