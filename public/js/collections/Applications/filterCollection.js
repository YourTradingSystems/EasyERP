define([
    'models/ApplicationsModel',
    'common'
],
    function (ApplicationModel, common) {
        var TasksCollection = Backbone.Collection.extend({
            model: ApplicationModel,
            url: "/Applications/",
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
                };
                this.fetch({
                    data: filterObject,
                    reset: true,
                    success: function(model,response) {
                        console.log("Application fetchSuccess");
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

            showMore: function (options) {
                var that = this;
                var filterObject = {};
                filterObject['page'] = this.page;
                filterObject['count'] = this.count;
                var NewCollection = Backbone.Collection.extend({
                    model: ApplicationModel,
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
                    _.map(response.data, function (application) {
                    	application.creationDate = common.utcDateToLocaleDate(application.creationDate);
                    	application.nextAction = common.utcDateToLocaleDate(application.nextAction);
                        application.createdBy.date = common.utcDateToLocaleDateTime(application.createdBy.date);
                        application.editedBy.date = common.utcDateToLocaleDateTime(application.editedBy.date);
                        return application;
                    });
                }
                return response.data;
            },

            fetchError: function (error) {
            }
        });

        return TasksCollection;
    });