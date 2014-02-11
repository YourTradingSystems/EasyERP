define([
    'models/OpportunitiesModel',
    'common'
],
    function (OpportunityModel, common) {
        var OpportunitiesCollection = Backbone.Collection.extend({
            model: OpportunityModel,

            initialize: function (options) {
                console.log("Opportunities Collection Init");
            },

            parse: true,

            parse: function (response) {
                if (response && response.data) {
                    _.map(response.data, function (opportunity) {
                        if (opportunity.nextAction)
                            opportunity.nextAction.date = (opportunity.nextAction) ? common.utcDateToLocaleDate(opportunity.nextAction.date) : '';
                        return opportunity;
                    });
                   
                }
                return response.data;
            },

            fetchSuccess: function (collection, response) {
                console.log("Async fetch-------------------------");
            },

            fetchError: function (error) {
            }

        });

        return OpportunitiesCollection;
    });
