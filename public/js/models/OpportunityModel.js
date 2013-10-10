define(function () {
    var OpportunityModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name: '',
            expectedRevenue: {
                value: '',
                currency: '',
                progress: ''
            },
            customer: {
                id: '',
                name: ''
            },
            email: '',
            phone: '',
            salesPerson: {
                id: '',
                name: ''
            },
            salesTeam: {
                id: '',
                name: ''
            },
            internalNotes: '',
            nextAction: {
                date: null,
                desc: ''
            },
            expectedClosing: null,
            priority: 'Trivial',
            categories: '',
            workflow: {
                name: 'New',
                status: 'New'
            }
        },

        urlRoot: function () {
            return "/Opportunities";
        }
    });

    return OpportunityModel;
});