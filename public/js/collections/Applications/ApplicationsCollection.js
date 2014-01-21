define([
    'models/ApplicationsModel',
    'common'
],
    function (ApplicationModel, common) {
        var ApplicationsCollection = Backbone.Collection.extend({
            model: ApplicationModel,
            url: function () {
                return "/Applications";
            },

            initialize: function () {
                console.log("Applications Collection Init");

            /*    var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                }); */
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (application) {

                        application.creationDate = common.utcDateToLocaleDate(application.creationDate);
                        if (application.nextAction)
                            application.nextAction = common.utcDateToLocaleDate(application.nextAction);
						if (application.createdBy)
                            application.createdBy.date = common.utcDateToLocaleDateTime(application.createdBy.date);
						if (application.editedBy)
                            application.editedBy.date = common.utcDateToLocaleDateTime(application.editedBy.date);
                        return application;
                    });
                }
                //this.listLength = response.listLength;
                return response.data;
            },

            fetchSuccess: function (collection, response) {
                console.log("Applications fetchSuccess....>>>>>>>>>>>>>");
            },

            fetchError: function (error) {

            }

        });

        return ApplicationsCollection;
    });