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
            workAddress: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            workEmail: '',
            workPhones: {
                mobile: '',
                phone: ''
            },
            officeLocation: '',
            relatedUser: {
                id: '',
                login: ''
            },
            visibility: 'Public',
            department: {
                id: '',
                name: ''
            },
            jobPosition: {
                id: '',
                name: ''
            },
            manager: {
                id: '',
                name: ''
            },
            coach: {
                id: '',
                name: ''
            },
            nationality: '',
            identNo: '',
            passportNo: '',
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