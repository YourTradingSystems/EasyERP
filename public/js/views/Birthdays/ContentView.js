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
            var now = new Date();
            var monthModels = [],
                weekModels = [],
                birthday,
                today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                lastDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                daysToAdd = 7 - today.getDay();
            this.$el.html(_.template(ListTemplate));
            var list = this.$el.find('#birthdaysList');
            lastDay.setDate(today.getDate() + daysToAdd);
            _.each(this.employeesCollection.models, function (model) {
                if (model.get('dateBirth')) {
                    birthday = new Date(common.ISODateToDate(model.get('dateBirth')));
                    if (birthday.getMonth() == today.getMonth() && birthday.getDate() >= today.getDate()) {
                        monthModels.push(model);
                    }
                    birthday.setFullYear(today.getFullYear());
                    birthday.setHours(0);
                    var valueOfBirthday = birthday.valueOf();
                    if ((valueOfBirthday <= lastDay.valueOf() && valueOfBirthday >= today.valueOf())) {
                            weekModels.push(model);
                        }
                    }
            }, this);
            _.each(weekModels, function (model) {
                list.find("#weekList").append(new ListItemView({ model: model }).render().el);
            }, this);
            _.each(weekModels, function (weekModel) {
                _.each(monthModels, function (model) {
                    if (weekModel.get('_id') == model.get('_id')) {
                        monthModels.splice(monthModels.indexOf(model), 1);
                    }
                }, this);
            }, this);
            _.each(monthModels, function (model) {
                list.find("#monthList").append(new ListItemView({ model: model }).render().el);
            }, this);
        }
    });
    common.contentHolderHeightFixer();
    return ContentView;
});
