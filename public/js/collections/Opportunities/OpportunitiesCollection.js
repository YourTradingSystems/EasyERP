define([
    'models/OpportunitiesModel',
    'common'
],
    function (OpportunityModel, common) {
        var OpportunitiesCollection = Backbone.Collection.extend({
            model: OpportunityModel,
            url: "/Opportunities/",
            page: 1,
            initialize: function (options) {
                this.startTime = new Date();
                var that = this;
                this.page = options.page;
                if (options && options.viewType) {
                    this.url += options.viewType;
                    var viewType = options.viewType;
                    delete options.viewType;
                }
                var filterObject = {};
                for (var i in options) {
                    filterObject[i] = options[i];
                };
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
                var NewCollection = Backbone.Collection.extend({
                    model: OpportunityModel,
                    url: that.url,
                    parse: true,
                    parse: function (response) {
                        return response.data;
                    },
                    page: that.page,
                });

                var newCollection = new NewCollection();

                newCollection.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models, response) {
                        that.page += 1;
                        that.showMoreButton = response.showMore;
                        that.optionsArray = response.options;
                        that.listLength = response.listLength;
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
                    _.map(response.data, function (opportunity) {
                        opportunity.creationDate = common.utcDateToLocaleDate(opportunity.creationDate);
                        opportunity.expectedClosing = common.utcDateToLocaleDate(opportunity.expectedClosing);
                        if (opportunity.nextAction)
                            opportunity.nextAction.date = (opportunity.nextAction) ? common.utcDateToLocaleDate(opportunity.nextAction.date) : '';
                        if (opportunity.createdBy)
                            opportunity.createdBy.date = common.utcDateToLocaleDateTime(opportunity.createdBy.date);
                        if (opportunity.editedBy)
                            opportunity.editedBy.date = common.utcDateToLocaleDateTime(opportunity.editedBy.date);
                        return opportunity;
                    });
                }
                this.listLength = response.listLength;
                return response.data;
            }
        });

        return OpportunitiesCollection;
    });
