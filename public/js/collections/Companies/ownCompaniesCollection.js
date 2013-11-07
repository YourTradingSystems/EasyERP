define([
    'models/CompanyModel',
    'common'
],
    function (CompanyModel, common) {
        var CompaniesCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url: function () {
                return "/ownCompanies";
            },

            initialize: function () {
                console.log("Companies Collection Init");
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
                if (response.data) {
                    _.map(response.data, function (company) {
                        company.salesPurchases.date = common.utcDateToLocaleDate(company.salesPurchases.date);
                        return company;
                    });
                }
                return response.data;
            },

            fetchSuccess: function (collection, response) {
                console.log("OwnCompanies fetchSuccess");
            },
            fetchError: function (error) {

            }


        });

        return CompaniesCollection;
    });