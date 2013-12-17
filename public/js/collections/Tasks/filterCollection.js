define([
    'models/TasksModel',
    'common'
],
    function (TaskModel, common) {
        var TasksCollection = Backbone.Collection.extend({
            model: TaskModel,
            url: "/Tasks/",
            page: 1,
            count: 13,

            initialize: function (options) {
                this.count = options.count;
                this.page = options.page;
                var that = this;

                if (options && options.viewType) {
                    this.url += options.viewType;
                    delete options.viewType;
                }

                var filterObject = {};
                for (var i in options) {
                    filterObject[i] = options[i];
                }

                this.fetch({
                    data: filterObject,
                    reset: true,
                    success: function(models, response) {
                        console.log("Tasks fetchSuccess");
                        that.page += 1;
                        that.showMoreButton = response.showMore;
                        that.optionsArray = response.options;
                    },
                    error: this.fetchError
                });
            },

            filterByWorkflow: function (id) {
                return this.filter(function (data) {
                    return data.get("workflow")._id == id;
                });
            },

            showMore: function () {
                var that = this;
                var filterObject = {};
                filterObject['page'] = this.page;
                filterObject['count'] = this.count;
                var NewCollection = Backbone.Collection.extend({
                    model: TaskModel,
                    url: that.url,
                    parse: true,
                    parse: function(response) {
                        return response.data;
                    },
                    page: that.page,

                    filterByWorkflow: function (id) {
                        return this.filter(function (data) {
                            return data.get("workflow")._id == id;
                        });
                    }
                });
                var newCollection = new NewCollection();

                newCollection.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models, response) {
                        that.showMoreButton = response.showMore;
                        that.optionsArray = response.options;
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
            }

            
        });

        return TasksCollection;
    });