define([
    'models/LeadsModel',
    'common'
],
    function (LeadModel, common) {
        var LeadsCollection = Backbone.Collection.extend({
            model: LeadModel,
            url: function () {
                return "/Leads";
            },

            initialize: function () {
                console.log("Leads Collection Init");

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
                console.log("Leads fetchSuccess");
            },

            fetchError: function (error) {

            }

        });

        return LeadsCollection;
    });