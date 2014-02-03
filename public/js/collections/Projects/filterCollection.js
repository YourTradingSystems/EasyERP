define([
    'models/ProjectsModel',
    'common'
],
    function (ProjectModel, common) {
        var ProjectsCollection = Backbone.Collection.extend({
            model: ProjectModel,
            url: "/Projects/",
            page: 1,
            namberToShow: null,
            viewType: null,

            initialize: function (options) {
                var that = this;

                this.startTime = new Date();
                this.namberToShow = options.count;

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
                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['status'] = [];
                filterObject['status'] = (options && options.status) ? options.status : this.status;

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
                    _.map(response.data, function (project) {
                        if (project.createdBy)
                            project.createdBy.date = common.utcDateToLocaleDateTime(project.createdBy.date);
                        if (project.editedBy)
                            project.editedBy.date = common.utcDateToLocaleDateTime(project.editedBy.date);
                        if (project.info) {
                            project.info.StartDate = common.utcDateToLocaleDate(project.info.StartDate);
                            project.info.EndDate = common.utcDateToLocaleDate(project.info.EndDate);
                        }
                        //project.deadline = common.utcDateToLocaleDate(project.deadline);
                        if (project.notes) {
                            _.map(project.notes, function (note) {
                                note.date = common.utcDateToLocaleDate(note.date);
                                return note;
                            });
                        }

                        if (project.attachments) {
                            _.map(project.attachments, function (attachment) {
                                attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                                return attachment;
                            });
                        }
                        return project;
                    });
                }
                this.listLength = response.listLength;
                return response.data;
            }


        });

        return ProjectsCollection;
    });
