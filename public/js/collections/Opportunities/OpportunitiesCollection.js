define([
    'models/OpportunityModel'
],
    function (OpportunityModel) {
        var OpportunitiesCollection = Backbone.Collection.extend({
            model: OpportunityModel,
            url: function () {
                return "/Opportunities";
            },

            initialize: function () {
                console.log("Opportunities Collection Init");
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
                console.log("Opportunities fetchSuccess");
            },

            fetchError: function (error) {
            }

        });

        return OpportunitiesCollection;
    });