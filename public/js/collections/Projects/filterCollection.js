define([
    'models/ProjectsModel',
    'common'
],
    function (ProjectModel, common) {
        var ProjectsCollection = Backbone.Collection.extend({
            model: ProjectModel,
            url: "/Projects/",
            page: 1,
            initialize: function (options) {
                var that = this;
                this.namberToShow = options.count;
                if (options && options.viewType) {
                    this.url += options.viewType;
                    delete options.viewType;
                }
                var filterObject = {};
                for (var i in options) {
                    filterObject[i] = options[i];
                };
                filterObject['count'] = filterObject['count']*2;
                this.fetch({
                    data: filterObject,
                    reset: true,
                    success: function() {
                        console.log("Projects fetchSuccess");
                        that.page += 2;
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
                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
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
                    _.map(response.data, function (project) {
                        project.createdBy.date = common.utcDateToLocaleDateTime(project.createdBy.date);
                        project.editedBy.date = common.utcDateToLocaleDateTime(project.editedBy.date);
                      //  project.extrainfo.StartDate = common.utcDateToLocaleDate(project.extrainfo.StartDate);
                      //  project.extrainfo.EndDate = common.utcDateToLocaleDate(project.extrainfo.EndDate);
                      //  project.deadline = common.utcDateToLocaleDate(project.deadline);
                        return project;
                    });
                }
                return response.data;
            }

            
        });

        return ProjectsCollection;
    });