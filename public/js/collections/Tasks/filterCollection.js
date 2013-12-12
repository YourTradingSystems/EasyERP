define([
    'models/TasksModel',
    'common',
    'collections/Workflows/WorkflowsCollection',
],
    function (TaskModel, common, WorkflowsCollection) {
        var TasksCollection = Backbone.Collection.extend({
            model: TaskModel,
            url: "/Tasks/",
            page: 1,
            count: 13,
            columnLimit: 13,

            initialize: function (options) {
                this.columnLimit = options.count;
                this.page = options.page;
                this.workflowsCollection = new WorkflowsCollection({ id: 'Task' });
                this.workflowsCollection.bind('reset', this.fetchModels, this);

                if (options && options.viewType) {
                    this.url += options.viewType;
                    delete options.viewType;
                }

                this.filterObject = {};
                for (var i in options) {
                    this.filterObject[i] = options[i];
                }
            },
            filterByWorkflow: function (id) {
                return this.filter(function (data) {
                    return data.get("workflow")._id == id;
                });
            },
            fetchModels: function () {
                debugger;
                this.count = this.workflowsCollection.length * this.columnLimit;
                this.filterObject['count'] = this.count+1;
                var localFilterObject = this.filterObject;
                var that = this;
                this.fetch({
                    data: localFilterObject,
                    reset: true,
                    success: function(models) {
                        console.log("Tasks fetchSuccess");
                        that.page += 1;
                    },
                    error: this.fetchError
                });

            },
            showMore: function () {
                debugger;
                var that = this;
                var filterObject = {};
                filterObject['page'] = this.page;
                filterObject['count'] = this.count+1;
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