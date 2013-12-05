define([
    'models/LeadsModel',
    'common'
],
    function (CompanyModel, common) {
        var LeadsCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url: "/Leads/",
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
                        console.log("Leads fetchSuccess");
                        that.page += 1;
                    },
                    error: this.fetchError
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
                    _.map(response.data, function (lead) {
                        lead.creationDate = common.utcDateToLocaleDate(lead.creationDate);
                        return lead;
                    });
                }
                return response.data;
            }

            
        });

        return LeadsCollection;
    });