define(function () {
    var ApplicationModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            isEmployee: false,
            subject: '',
            name: {
                first: 'New',
                last: 'Application'
            },
            tags: [],
            workEmail: '',
            workPhones: {
                mobile: '',
                phone: ''
            },
            degree: {
                id: '',
                name:''
            },
            relatedUser: {
                id: '',
                login: ''
            },
            department: {
                id: '',
                name: ''
            },
            jobPosition: {
                id: '',
                name: ''
            },
            nextAction: null,
            source: {
                id: '',
                name: ''
            },
            referredBy: '',
            expectedSalary: 0,
            proposedSalary: 0,
            otherInfo: '',
            workflow: {
                name: 'Initial Qualification',
                status: 'New'
            },
        },

        urlRoot: function () {
            return "/Applications";
        }
    });

    return ApplicationModel;
});