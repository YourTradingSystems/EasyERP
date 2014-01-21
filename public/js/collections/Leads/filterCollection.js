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
				this.startTime = new Date();
                this.status = [];
                this.status = options.status;
                this.count = options.count;
                this.page = options.page;
                this.namberToShow = options.count;

                var that = this;
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
                    success: function(model, response) {
                        console.log("Leads fetchSuccess");
                        that.page += addPage;
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
                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
                filterObject['status'] = [];
                filterObject['status'] = (options && options.status) ? options.status: this.status;
                filterObject['isConverted'] = (options && options.isConverted) ? options.isConverted: this.isConverted;

                if (options.viewType && options.viewType == 'list') {
                    this.fetch({
                        data: filterObject,
                        waite: true,
                        success: function (models, response) {
                            that.showMoreButton = response.showMore;
                            that.optionsArray = response.options;
                            that.page += 1;
                            that.listLength = response.listLength;
                            that.trigger('showmore', models);
                            that.add(newCollection.toJSON());
                        },
                        error: function() {
                            alert('Some Error');
                        }
                    });
                } else {
                    var NewCollection = Backbone.Collection.extend({
                        model: CompanyModel,
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
                            that.listLength = response.listLength;
                            that.trigger('showmore', models);
                            that.add(newCollection.toJSON());
                        },
                        error: function() {
                            alert('Some Error');
                        }
                    });
                }
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (lead) {
						if(lead.createdBy)
							lead.createdBy.date = common.utcDateToLocaleDateTime(lead.createdBy.date);
						if(lead.editedBy)
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
