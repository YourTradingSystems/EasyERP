define(function () {
    var TaskModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            summary: '',
            project: {
                id: '',
                name: ''
            },
            assignedTo: {
                id: '00000',
                name: 'emptyUser'
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
            loged: 0,
            remaining: 0,
            progress: 0
        },

        urlRoot: function () {
            return "/Tasks";
        }
    });

    return TaskModel;
});