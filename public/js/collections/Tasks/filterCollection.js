define([
    'models/TasksModel',
    'common'
],
    function (TaskModel, common) {
        var TasksCollection = Backbone.Collection.extend({
            model: TaskModel,
            url: "/Tasks/",
            page: 1,
            initialize: function (options) {
                var that = this;
                if (options && options.viewType) {
                    this.url += options.viewType;
                    delete options.viewType;
                }
                var filterObject = {};
                for (var i in options) {
                    filterObject[i] = options[i];
                };
                this.fetch({
                    data: filterObject,
                    reset: true,
                    success: function() {
                        console.log("Tasks fetchSuccess");
                        that.page += 1;
                    },
                    error: this.fetchError
                });
            },
            filterByWorkflow: function (id) {
                return this.filter(function (data) {
                    return data.get("workflow")._id == id;
                });
            },
            showMore: function (options) {
                var that = this;
                
                var filterObject = {};
                if (options) {
                    for (var i in options) {
                        filterObject[i] = options[i];
                    }
                }
                filterObject['page'] = (filterObject.hasOwnProperty('page')) ? filterObject['page'] : this.page;
                filterObject['count'] = (filterObject.hasOwnProperty('count')) ? filterObject['count'] : 10;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error: function() {
                        alert('Some Error');
                    }
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (task) {
                        task.createdBy.date = common.utcDateToLocaleDateTime(task.createdBy.date);
                        task.editedBy.date = common.utcDateToLocaleDateTime(task.editedBy.date);
                        task.extrainfo.StartDate = common.utcDateToLocaleDate(task.extrainfo.StartDate);
                        task.extrainfo.EndDate = common.utcDateToLocaleDate(task.extrainfo.EndDate);
                        task.deadline = common.utcDateToLocaleDate(task.deadline);
                        return task;
                    });
                }
                return response.data;
            },

            
        });

        return TasksCollection;
    });