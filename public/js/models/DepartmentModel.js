define(function () {
    var departmentModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            departmentName: 'emptyDepartment',
            parentDepartment: {
                departmentId: null,
                departmentName: null
            },
            departmentManager: {
                uid: null,
                uname: ''
            }
        },

        urlRoot: function () {
            return "/Departments";
        }
    });

    return departmentModel;
});