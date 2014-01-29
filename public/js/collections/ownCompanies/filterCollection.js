define([
    'models/CompaniesModel',
    'common'
],
    function (CompanyModel, common) {
        var CompaniesCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url: "/ownCompanies/",
            page: 1,
            namberToShow: null,
            viewType: null,
            contentType: null,

            initialize: function (options) {
                var that = this;

                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.startTime = new Date();
                this.namberToShow = options.count;

                if (options && options.viewType) {
                    this.url += options.viewType;
                    //delete options.viewType;
                }

                this.fetch({
                    data: options,
                    reset: true,
                    success: function() {
                        that.page ++;
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
                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType: this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType: this.contentType;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                        alert('Some error');
                    }
                });
            },

            showMoreAlphabet: function (options) {
                debugger;
                var that = this;
                var filterObject = options || {};
                that.page = 1;
                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType: this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType: this.contentType;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmoreAlphabet', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            },

            getAlphabet: function (callback) {
                dataService.getData("/getCompaniesAlphabet", { mid: 39 }, function (response) {
                    if (callback){
                        callback(response.data);
                    }
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (company) {
                        if (company.createdBy)
                            company.createdBy.date = common.utcDateToLocaleDateTime(company.createdBy.date);
                        if (company.editedBy)
                            company.editedBy.date = company.editedBy.user ? common.utcDateToLocaleDateTime(company.editedBy.date) : null;
                        return company;
                    });
                }
                return response.data;
            }

            
        });

        return CompaniesCollection;
    });
