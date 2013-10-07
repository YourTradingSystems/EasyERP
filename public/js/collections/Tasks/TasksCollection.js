define([
    'models/TaskModel'
],
    function (TaskModel) {
        var TasksCollection = Backbone.Collection.extend({
            model: TaskModel,
            url: function () {
                return "/Tasks";
            },

            initialize: function () {
                var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse: true,

            parse: function (response) {
                return response.data;
            },

            fetchSuccess: function (collection, response) {
            },
            fetchError: function (error) {
            }
        });

        return TasksCollection;
    });