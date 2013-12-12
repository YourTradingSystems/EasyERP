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
                        console.log("Opportunities fetchSuccess");
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
                     _.map(response.data, function (opportunity) {
                         opportunity.creationDate = common.utcDateToLocaleDate(opportunity.creationDate);
                         opportunity.expectedClosing = common.utcDateToLocaleDate(opportunity.expectedClosing);
                         opportunity.nextAction.date = common.utcDateToLocaleDate(opportunity.nextAction.date);
                         opportunity.createdBy.date = common.utcDateToLocaleDateTime(opportunity.createdBy.date);
                         opportunity.editedBy.date = common.utcDateToLocaleDateTime(opportunity.editedBy.date);
                         return opportunity;
                     });
                 }
                return response.data;
            }
        });

        return OpportunitiesCollection;
    });