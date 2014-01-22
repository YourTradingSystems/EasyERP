define([
    'models/EmployeesModel',
    'common'
],
    function (EmployeeModel, common) {
        var EmployeesCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url: "/Birthdays",
            initialize: function (options) {
				this.startTime = new Date();
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
                    if (response.data.weekly) {
                        _.map(response.data.weekly, function (employee) {
                            employee.dateBirth = common.utcDateToLocaleDateTime(employee.dateBirth, true);
                            //employee.createdBy.date = common.utcDateToLocaleDateTime(employee.createdBy.date);
                            //employee.editedBy.date = common.utcDateToLocaleDateTime(employee.editedBy.date);
                            return employee;
                        });
                    }
                    if (response.data.monthly) {
                        _.map(response.data.monthly, function (employee) {
                            employee.dateBirth = common.utcDateToLocaleDateTime(employee.dateBirth, true);
                            //employee.createdBy.date = common.utcDateToLocaleDateTime(employee.createdBy.date);
                            //employee.editedBy.date = common.utcDateToLocaleDateTime(employee.editedBy.date);
                            return employee;
                        });
                    }
                }
                return response.data;
            }

            
        });

        return EmployeesCollection;
    });
