define(function () {
    var CompanyModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            image: '',
            isOwnCompany: false,
            email: '',
            name: 'emptyCompany',
            address: {
                street: '',
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
                salesPerson: {
                    id: '',
                    name: ''
                },
                salesTeam: {
                    id: '',
                    name: ''
                },
                active: true,
                reference: '',
                language: 'English',
                date: null,
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