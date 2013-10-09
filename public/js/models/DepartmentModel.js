define(function () {
    var departmentModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            departmentName: 'emptyDepartment',
            parentDepartment: {
                id: null,
                name: null
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