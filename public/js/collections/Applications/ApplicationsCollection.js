define([
    'models/ApplicationsModel'
],
    function (ApplicationModel) {
        var ApplicationsCollection = Backbone.Collection.extend({
            model: ApplicationModel,
            url: function () {
                return "/Applications";
            },

            initialize: function () {
                console.log("Applications Collection Init");

                var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse: true,

            parse: function (response) {
                return response.data;
            },

            fetchSuccess: function (collection, response) {
                console.log("Applications fetchSuccess");
            },

            fetchError: function (error) {

            }

        });

        return ApplicationsCollection;
    });