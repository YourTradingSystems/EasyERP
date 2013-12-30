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
            this.employeesCollection = options.collection.toJSON()[0];
            this.render();
        },

        render: function () {
            console.log('Render Birthday View');
            this.$el.html(_.template(ListTemplate));
            var list = this.$el.find('#birthdaysList');
            list.find("#weekList").append(new ListItemView({ collection: this.employeesCollection.weekly }).render().el);
            list.find("#monthList").append(new ListItemView({ collection: this.employeesCollection.monthly }).render().el);
        }
    });
    return ContentView;
});
