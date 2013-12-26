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
                this.namberToShow = options.count;
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
                    success: function() {
                        console.log("Leads fetchSuccess");
                        that.page += addPage;
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
                    _.map(response.data, function (lead) {
                        lead.createdBy.date = common.utcDateToLocaleDateTime(lead.createdBy.date);
                        lead.editedBy.date = common.utcDateToLocaleDateTime(lead.editedBy.date);
                        return lead;
                    });
                }
                this.listLength = response.listLength;
                return response.data;
            }

            
        });

        return LeadsCollection;
    });