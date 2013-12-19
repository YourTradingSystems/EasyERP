define([
    'models/CompaniesModel',
    'common'
],
    function (CompanyModel, common) {
        var CompaniesCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url: "/Companies/",
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
                        console.log("Companies fetchSuccess");
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
                    _.map(response.data, function (company) {
                        company.createdBy.date = common.utcDateToLocaleDateTime(company.createdBy.date);
                        company.editedBy.date = company.editedBy.date ? common.utcDateToLocaleDateTime(company.editedBy.date) :  null;
                        return company;
                    });
                }
                return response.data;
            }

            
        });

        return CompaniesCollection;
    });