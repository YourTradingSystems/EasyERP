define([
    'models/DepartmentsModel'
],
    function (DepartmentsModel) {
        var departmentsCollection = Backbone.Collection.extend({
            model: DepartmentsModel,
            url: function () {
                return "/Departments";
            },

            initialize: function () {
                console.log("Departments Collection Init");

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
                console.log("Departments fetchSuccess");
            },
            fetchError: function (error) {

            }


        });

        return departmentsCollection;
    });