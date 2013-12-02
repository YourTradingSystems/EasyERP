define([
    'models/TasksModel',
    'common'
],
    function (TaskModel, common) {
        var TasksCollection = Backbone.Collection.extend({
            model: TaskModel,
            url: function () {
                return "/Tasks/kanban";
            },
            page: 1,
            initialize: function (parrentContentId) {
                this.fetch({
                    data: {
                        mid: 19,
                        pId: parrentContentId,
                        page: this.page,
                        count: 10
                    },
                    reset:true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            showMore: function () {
                this.fetch({
                    data: {
                        mid: 19,
                        page: this.page,
                        count: 10
                    },
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (task) {
                        task.extrainfo.StartDate = common.utcDateToLocaleDate(task.extrainfo.StartDate);
                        task.extrainfo.EndDate = common.utcDateToLocaleDate(task.extrainfo.EndDate);
                        task.deadline = common.utcDateToLocaleDate(task.deadline);
                        return task;
                    });
                }
                return response.data;
            },

            fetchSuccess: function () {
                console.log("Tasks fetchSuccess");
                this.page += 1;
            },
            fetchError: function (error) {
            }
        });

        return TasksCollection;
    });