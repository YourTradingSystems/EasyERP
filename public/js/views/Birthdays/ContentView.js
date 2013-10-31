define([
    'text!templates/Birthdays/list/ListTemplate.html',
    'views/Birthdays/list/ListItemView',
    'common',
    'custom'
],
function (ListTemplate, ListItemView, common, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Employees View');
            this.employeesCollection = options.collection;;
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
                lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                lastDayOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                daysToAdd = 7 - today.getDay();
            this.$el.html(_.template(ListTemplate));
            var list = this.$el.find('#birthdaysList');
            lastDayOfMonth.setDate(today.getDate() + 60);
            lastDayOfWeek.setDate(today.getDate() + daysToAdd);
           
            _.each(this.employeesCollection.models, function (model) {
                if (model.get('dateBirth')) {
                    birthday = new Date(common.ISODateToDate(model.get('dateBirth')));
                    birthday.setFullYear(today.getFullYear());
                    birthday.setHours(0);
                    var valueOfBirthday = birthday.valueOf(),
                        valueOfToday = today.valueOf();
                    if (valueOfBirthday >= valueOfToday) {
                        if (valueOfBirthday <= lastDayOfMonth.valueOf()) {
                            monthModels.push(model);
                        }

                        if ((valueOfBirthday <= lastDayOfWeek.valueOf())) {
                            weekModels.push(model);
                        }
                    }
                }
            }, this);
            _.each(weekModels, function (model) {
                list.find("#weekList").append(new ListItemView({ model: model }).render().el);
            }, this);
            _.each(monthModels, function (model) {
                list.find("#monthList").append(new ListItemView({ model: model }).render().el);
            }, this);
        }
    });
    common.contentHolderHeightFixer();
    return ContentView;
});
