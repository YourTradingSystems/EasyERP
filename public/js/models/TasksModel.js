define(function () {
    var TaskModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function () {
            this.on('invalid', function (model, errors) {
                if (errors.length > 0) {
                    var msg = $.map(errors, function (error) {
                        return error.msg;
                    }).join('\n');
                    alert(msg);
                }
            });
        },

        validate: function (attrs) {
            var errors = [];
            if (attrs.summary.trim() === "") {
                errors.push(
                    {
                        name: "Summary",
                        field: "summary",
                        msg: "Summary name can not be empty"
                    }
                );
            }
            if ($.trim(attrs.project) === "") {
                errors.push(
                    {
                        name: "Project",
                        field: "project",
                        msg: "Project should be selected"
                    }
                );
            }
            if (errors.length > 0)
                return errors;
        },
        defaults: {
            summary: '',
            taskCount: 0,
            type: '',
            project: '',
            assignedTo: '',
            deadline: null,
            tags: [],
            description: '',
            extrainfo: {
                priority: 'Medium',
                duration: null,
                sequence: 0,
                customer:'',
                StartDate: null,
                EndDate: null
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