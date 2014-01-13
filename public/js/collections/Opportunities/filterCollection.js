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
                var that = this;
                this.status = [];
                this.status = options.status;
                this.namberToShow = options.count;
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

                switch (viewType) {
                    case 'thumbnails': {
                        filterObject['count'] = filterObject['count']*2;
                        var addPage = 2;
                        break;
                    }
                    case 'list': {
                        filterObject['page'] = 1;
                        filterObject['status'] = [];
                        filterObject['status'] = options.status;
                        var addPage = 0;
                        break;
                    }
                    default: {
                        var addPage = 1;
                    }
                }

                this.fetch({
                    data: filterObject,
                    reset: true,
                    success: function(models,response) {
                        console.log("Opportunities fetchSuccess");
                        that.showMoreButton = response.showMore;
                        that.optionsArray = response.options;
                        that.page += addPage;
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
                filterObject['status'] = [];
                filterObject['status'] = (options && options.status) ? options.status: this.status;
                var NewCollection = Backbone.Collection.extend({
                    model: OpportunityModel,
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
                    success: function (models,response) {
                        that.page += 1;
                        that.showMoreButton = response.showMore;
                        that.optionsArray = response.options;
                        that.listLength = response.listLength;
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
                     _.map(response.data, function (opportunity) {
                         opportunity.creationDate = common.utcDateToLocaleDate(opportunity.creationDate);
                         opportunity.expectedClosing = common.utcDateToLocaleDate(opportunity.expectedClosing);
						 if (opportunity.nextAction)
							 opportunity.nextAction.date = ( opportunity.nextAction) ? common.utcDateToLocaleDate(opportunity.nextAction.date):'';
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
