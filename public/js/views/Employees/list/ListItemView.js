define([
    'text!templates/Employees/list/ListTemplate.html'
],

function (EmployeesListTemplate) {
    var EmployeesListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        render: function() {
            this.$el.append(_.template(EmployeesListTemplate, { employeesCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return EmployeesListItemView;
});
