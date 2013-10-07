define([
    'models/DegreeModel'
],
    function (DegreeModel) {
        var DegreesCollection = Backbone.Collection.extend({
            model: DegreeModel,
            url: function () {
                return "/Degrees";
            },

            initialize: function () {
                console.log("Degrees Collection Init");

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
                console.log("Degrees fetchSuccess");
            },

            fetchError: function (error) {

            }

        });

        return DegreesCollection;
    });