define([
    'models/ProjectsModel'
],
    function (ProjectModel) {
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
                this.wfStatus = [];
                this.wfStatus = options.status;
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
                this.listLength = response.listLength;
                return response.data;
            }
        });

        return ProjectsCollection;
    });
