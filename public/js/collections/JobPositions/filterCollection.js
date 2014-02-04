define([
    'models/JobPositionsModel',
    'common'
],
    function (JobPositionsModel, common) {
        var JobPositionsCollection = Backbone.Collection.extend({
            model: JobPositionsModel,
            url: "/JobPositions/",
            page: 1,
            namberToShow: null,

            initialize: function (options) {
				this.startTime = new Date();

                var that = this;

                this.namberToShow = options.count;

                if (options && options.viewType) {
                    this.url += options.viewType;
                   // delete options.viewType;
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

            showMore: function (options) {
                var that = this;

                var filterObject = options || {};

                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page ++;
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
                    _.map(response.data, function (jopPosition) {
						if (jopPosition.createdBy)
							jopPosition.createdBy.date = common.utcDateToLocaleDateTime(jopPosition.createdBy.date);
						if (jopPosition.editedBy)
							jopPosition.editedBy.date = common.utcDateToLocaleDateTime(jopPosition.editedBy.date);
                        return jopPosition;
                    });
                }
                return response.data;
            }

            
        });

        return JobPositionsCollection;
    });
