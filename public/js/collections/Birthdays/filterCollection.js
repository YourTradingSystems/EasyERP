define([
    'models/EmployeesModel',
    'common'
],
    function (EmployeeModel, common) {
        var EmployeesCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url: "/Birthdays",
            initialize: function (options) {
                this.fetch({
                    reset: true,
                    success: function() {
                        console.log("Birthdays fetchSuccess");
                    },
                    error: this.fetchError
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (employee) {
                        employee.createdBy.date = common.utcDateToLocaleDateTime(employee.createdBy.date);
                        employee.editedBy.date = common.utcDateToLocaleDateTime(employee.editedBy.date);
                        return employee;
                    });
                }
                return response.data;
            }

            
        });

        return EmployeesCollection;
    });