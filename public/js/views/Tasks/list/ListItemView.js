/*define([
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
});*/
define([
    'text!templates/Tasks/list/ListTemplate.html'
],

    function (ListTemplate) {
        var TasksListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function(options) {
                this.collection = options.collection;
                this.startNumber = options.startNumber;
            },
            render: function() {
                this.$el.append(_.template(ListTemplate, { tasksCollection: this.collection.toJSON(), startNumber: this.startNumber }));
            }
        });

        return TasksListItemView;
    });
