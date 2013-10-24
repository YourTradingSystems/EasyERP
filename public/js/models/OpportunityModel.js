define(function () {
    var OpportunityModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            isOpportunitie: true,
            name: '',
            expectedRevenue: {
                value: '',
                currency: '',
                progress: ''
            },
            company: {
                id: '',
                name: ''
            },
            contactName: {
                first: '',
                last: ''
            },
            customer: {
                id: '',
                name: ''
            },
            address: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            email: '',
            phones: {
                mobile: '',
                phone: '',
                fax: ''
            },
           
            func: '',
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
            active: true,
            optout: false,
            reffered: '',
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