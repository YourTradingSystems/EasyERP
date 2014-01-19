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
                        opportunity.creationDate = common.utcDateToLocaleDate(opportunity.creationDate);
                        opportunity.expectedClosing = common.utcDateToLocaleDate(opportunity.expectedClosing);
                        if (opportunity.nextAction)
                            opportunity.nextAction.date = (opportunity.nextAction) ? common.utcDateToLocaleDate(opportunity.nextAction.date) : '';
                        if (opportunity.createdBy)
                            opportunity.createdBy.date = common.utcDateToLocaleDateTime(opportunity.createdBy.date);
                        if (opportunity.editedBy)
                            opportunity.editedBy.date = common.utcDateToLocaleDateTime(opportunity.editedBy.date);
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
