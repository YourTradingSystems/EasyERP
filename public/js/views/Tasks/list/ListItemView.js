define([
    'text!templates/Tasks/list/ListTemplate.html'
],

function (TasksListTemplate) {
    var TasksListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.model = options.model;
            this.index = options.index;
        },
        template: _.template(TasksListTemplate),
        render: function() {
            this.model.set('index', this.index);
            this.$el.append(this.template(this.model.toJSON()));
            return this;
        }
    });

    return TasksListItemView;
});
