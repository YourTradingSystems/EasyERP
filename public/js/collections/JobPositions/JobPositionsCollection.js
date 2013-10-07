define([
    'models/JobPositionModel'
],
    function (JobPositionModel) {
        var JobPositionsCollection = Backbone.Collection.extend({
            model: JobPositionModel,
            url: function () {
                return "/JobPosition";
            },

            initialize: function () {
                console.log("JobPosition Collection Init");

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
                console.log("JobPosition fetchSuccess");
            },
            fetchError: function (error) {

            }


        });

        return JobPositionsCollection;
    });