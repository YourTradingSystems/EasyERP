define(function () {
    var CompanyModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            image: '',
            isOwnCompany: false,
            cemail: '',
            cname: 'emptyCompany',
            caddress: {
                street1: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            cwebsite: '',
            contacts: [],
            cphones: {
                phone: '',
                mobile: '',
                fax: ''
            },
            cinternalNotes: '',
            csalesPurchases: {
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
                FB: '',
                LI: ''
            },
            chistory: []
        },

        urlRoot: function () {
            return "/Companies";
        }
    });

    return CompanyModel;
});