define([
    'text!templates/Tasks/list/ListTemplate.html'
],

function (TasksListTemplate) {
    var TasksListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = options.startNumber;
        },
        render: function() {
            this.$el.append(_.template(TasksListTemplate, { tasksCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return TasksListItemView;
});
