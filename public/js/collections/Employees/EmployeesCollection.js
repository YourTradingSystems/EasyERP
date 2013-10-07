define([
    'models/EmployeeModel'
],
    function (EmployeeModel) {
        var EmployeesCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url: function () {
                return "/Employees";
            },

            initialize: function () {
                console.log("Employees Collection Init");

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
                console.log("Employees fetchSuccess");
            },

            fetchError: function (error) {

            }

        });

        return EmployeesCollection;
    });