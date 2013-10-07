define(function () {
        var CustomerModel = Backbone.Model.extend({
            idAttribute: '_id'
        });

        var CustomersCollection = Backbone.Collection.extend({
            model: CustomerModel,
            url: function () {
                return "/Customer";
            },


            initialize: function () {

                console.log("Customer Collection Init");
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
                console.log("Customers fetchSuccess");
            },
            fetchError: function (error) {
                console.log("Customers fetchError");
            }


        });

        return CustomersCollection;
    });