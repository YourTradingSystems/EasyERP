define([
    'common',
    'Validation'
],
    function (common, Validation) {
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
        parse: true,

        parse: function (response) {
            if (response && response.extrainfo) {
                response.extrainfo.StartDate = common.utcDateToLocaleDate(response.extrainfo.StartDate);
                response.extrainfo.EndDate = common.utcDateToLocaleDate(response.extrainfo.EndDate);
                response.deadline = common.utcDateToLocaleDate(response.deadline);
            }
            return response;
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
            if(attrs.summary.length > 0){
                if(!Validation.validName(attrs.summary)){
                    errors.push(
                        {
                            name: "Task",
                            field: "summary",
                            msg: "Summary " + Validation.errorMessages['nameError']
                        }
                    );
                }
            }
            if (attrs.project === "") {
                errors.push(
                    {
                        name: "Project",
                        field: "project",
                        msg: "Project should be selected"
                    }
                );
            }
            if(attrs.deadline.length > 0){
                if(!Validation.validDate(attrs.deadline)){
                    errors.push(
                        {
                            name: "Tasks",
                            field: "deadline",
                            msg: "Deadline date is not a valid date"
                        }
                    );
                } else{
                    if(new Date(attrs.deadline) < new Date(attrs.extrainfo.StartDate)){
                        errors.push(
                            {
                                name: "Tasks",
                                field: "deadline",
                                msg: "Task start date can not be greater than deadline date"
                            }
                        );
                    }
                }
            }
            if(attrs.extrainfo.StartDate.length > 0){
                if(!Validation.validDate(attrs.extrainfo.StartDate)){
                    errors.push(
                        {
                            name: "Tasks",
                            field: "deadline",
                            msg: "Start date is not a valid date"
                        }
                    );
                }
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
            	priority: 'P3',
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