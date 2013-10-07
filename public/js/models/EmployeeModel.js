define(function () {
    var EmployeeModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            isEmployee: true,
            name: {
                first: 'New',
                last: 'Employee'
            },
            tags: [],
            waddress: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            wemail: '',
            wphones: {
                mobile: '',
                phone: ''
            },
            officeLocation: '',
            relatedUser: {
                id: '',
                login: ''
            },
            visibility: false,
            department: {
                departmentId: '',
                departmentName: ''
            },
            job: {
                jobPositionId: '',
                jobPositionName: ''
            },
            manager: {
                employeeId: '',
                employeeName: ''
            },
            coach: {
                employeeId: '',
                employeeName: ''
            },
            nationality: '',
            identNo: 0,
            passportNo: 0,
            bankAccountNo: '',
            otherId: '',
            homeAddress: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            dateBirth: null,
            active: true
        },

        urlRoot: function () {
            return "/Employees";
        }
    });

    return EmployeeModel;
});