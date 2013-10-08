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
                id: null,
                name: ''
            }
        },

        urlRoot: function () {
            return "/Departments";
        }
    });

    return departmentModel;
});