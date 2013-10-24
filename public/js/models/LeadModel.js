define(function () {
    var LeadModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            isOpportunitie: false,
            name: 'New Lead',
            company: {
                id: '',
                name: ''
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
            salesPerson: {
                id: '',
                name: ''
            },
            salesTeam: {
                id: '',
                name: ''
            },
            contactName: {
                first: '',
                last: ''
            },
            email: '',
            func: '',
            phones: {
                mobile: '',
                phone: '',
                fax: ''
            },
            
            priority: 'Trivial',
            categories: {
                id: '',
                name: ''
            },
            internalNotes:'',
            active: true,
            optout: false,
            reffered: '',
            workflow: {
                name: 'New',
                status:'New'
            }
        },

        urlRoot: function () {
            return "/Leads";
        }
    });

    return LeadModel;
});