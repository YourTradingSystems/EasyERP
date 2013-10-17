define([
    'text!templates/Birthdays/list/ListTemplate.html',
    'collections/Employees/EmployeesCollection',
    'views/Birthdays/list/ListItemView',
    'common',
    'custom'
],
function (ListTemplate, EmployeesCollection, ListItemView, common, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function () {
            console.log('Init Employees View');
            this.employeesCollection = new EmployeesCollection();
            this.employeesCollection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        render: function () {
            Custom.setCurrentCL(this.employeesCollection.models.length);
            console.log('Render Birthday View');
            var models = [],
                birthday;
            this.$el.html(_.template(ListTemplate));
            var list = this.$el.find('#birthdaysList');

            _.each(this.employeesCollection.models, function (model) {
                if (model.get('dateBirth')) {
                    birthday = new Date(common.ISODateToDate(model.get('dateBirth')).replace(/-/g, '/'));
                    if (birthday.getMonth() == new Date().getMonth() && birthday.getDate()>=new Date().getDate()) {
                        models.push(model);
                    }
                }
            }, this);
            _.each(models, function (model) {
                list.append(new ListItemView({ model: model }).render().el);
            }, this);

        }
    });

    return ContentView;
});
