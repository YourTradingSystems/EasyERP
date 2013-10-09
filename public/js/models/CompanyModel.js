define(function () {
    var CompanyModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            image: '',
            isOwnCompany: false,
            email: '',
            name: 'emptyCompany',
            address: {
                street1: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            website: '',
            contacts: [],
            phones: {
                phone: '',
                mobile: '',
                fax: ''
            },
            internalNotes: '',
            salesPurchases: {
                isCustomer: false,
                isSupplier: false,
                salesPerson: '',
                salesTeam: '',
                active: true,
                reference: '',
                language: 'English',
                date: null,
                receiveMessages: 0
            },
            social: {
                fb: '',
                li: ''
            },
            history: []
        },

        urlRoot: function () {
            return "/Companies";
        }
    });

    return CompanyModel;
});