define([
    "collections/Workflows/WorkflowsCollection"
],
    function (WorkflowsCollection) {
        var WorkflowsDdView = Backbone.View.extend({
            el: "select#workflowDd",
            template : _.template("<option value='<%= model._id%>' ><%= model.name%> (<%= model.status %>)</option>"),
            initialize: function () {
                this.collection = new WorkflowsCollection({ id: "Task" });
                this.collection.bind("reset", _.bind(this.render,this));
            },

            render: function () {
                var self = this;
                _.each(this.collection.toJSON()[0].value, function(model){
                    self.$el.append(self.template({model:model}));
                });
                return this;
            }
        });

        return WorkflowsDdView;
    });