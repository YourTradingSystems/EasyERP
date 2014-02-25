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
                        var msg = errors.join('\n');
                        alert(msg);
                    }
                });
            },
            parse: true,

            parse: function (response) {
                if (response.StartDate)
                    response.StartDate = common.utcDateToLocaleDate(response.StartDate);
                if (response.EndDate)
                    response.EndDate = common.utcDateToLocaleDate(response.EndDate);
                if (response && response.attachments) {
                    _.map(response.attachments, function (attachment) {
                        attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                        return attachment;
                    });
                }
                if (response.createdBy)
                    response.createdBy.date = common.utcDateToLocaleDateTime(response.createdBy.date);
                if (response.editedBy)
                    response.editedBy.date = common.utcDateToLocaleDateTime(response.editedBy.date);
                if (response && response.notes) {
                    _.map(response.notes, function (notes) {
                        notes.date = common.utcDateToLocaleDate(notes.date);
                        return notes;
                    });
                }
                return response;
            },

            validate: function (attrs) {
                var errors = [];

                Validation.checkNameField(errors, true, attrs.summary, "Summary");
                Validation.checkNameField(errors, true, attrs.project._id || attrs.project, "Project");
                Validation.checkNameField(errors, true, attrs.assignedTo._id || attrs.assignedTo, "AssignedTo");
                if (attrs.deadline && attrs.StartDate)
                    Validation.checkFirstDateIsGreater(errors, attrs.deadline, "deadline date", attrs.StartDate, "Start date");

                if (errors.length > 0)
                    return errors;
            },

            //defaults: {
            //    summary: '',
            //    taskCount: 0,
            //    type: '',
            //    project: '',
            //    assignedTo: '',
            //    deadline: null,
            //    tags: [],
            //    description: '',
            //    extrainfo: {
            //    	priority: 'P3',
            //        duration: null,
            //        sequence: 0,
            //        customer:'',
            //        StartDate: null,
            //        EndDate: null
            //    },

            //    color: '#4d5a75',
            //    estimated: 0,
            //    logged: 0,
            //    remaining: 0,
            //    progress: 0,
            //    notes:[]
            //},

            urlRoot: function () {
                return "/Tasks";
            }
        });

        return TaskModel;
    });
