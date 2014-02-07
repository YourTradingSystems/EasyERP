define([
    'models/TasksModel',
    'common'
],
    function (TaskModel, common) {
        var TasksCollection = Backbone.Collection.extend({
            model: TaskModel,
            url: "/Tasks/",
            page: 1,
            namberToShow: null,
            viewType: null,

            initialize: function (options) {
                this.startTime = new Date();
                this.parrentContentId = options.parrentContentId;
                this.namberToShow = options.count;
                this.count = options.count;
                var that = this;
                if (options && options.viewType) {
                    this.url += options.viewType;
                }
                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                        that.page++;
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
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
                if (options && options.page) {
                    this.page = options.page;
                }
                if (options && options.count) {
                    this.namberToShow = options.count;
                }
                filterObject['page'] = this.page;
                filterObject['count'] = this.namberToShow;
                filterObject['status'] = (options && options.status) ? options.status : [];

                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (task) {
                        if (task.createdBy)
                            task.createdBy.date = common.utcDateToLocaleDateTime(task.createdBy.date);
                        if (task.editedBy)
                            task.editedBy.date = common.utcDateToLocaleDateTime(task.editedBy.date);
                        // task.extrainfo.StartDate = common.utcDateToLocaleDate(task.extrainfo.StartDate);
                        // task.extrainfo.EndDate = common.utcDateToLocaleDate(task.extrainfo.EndDate);
                        // task.deadline = common.utcDateToLocaleDate(task.deadline);
                        if (task.notes) {
                            _.map(task.notes, function (note) {
                                note.date = common.utcDateToLocaleDate(note.date);
                                return note;
                            });
                        }

                        if (task.attachments) {
                            _.map(task.attachments, function (attachment) {
                                attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                                return attachment;
                            });
                        }
                        return task;
                    });
                }
                return response.data;
            }


        });

        return TasksCollection;
    });
