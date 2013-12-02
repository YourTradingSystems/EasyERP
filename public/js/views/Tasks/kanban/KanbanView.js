define([
        'text!templates/Tasks/kanban/WorkflowsTemplate.html',
        'collections/Workflows/WorkflowsCollection',
        'views/Tasks/kanban/KanbanItemView'
],
function (WorkflowsTemplate, WorkflowsCollection, TasksKanbanItemView) {
    var TaskKanbanView = Backbone.View.extend({
        el: '#content-holder',
        
        initialize: function(options) {
            this.workflowsCollection = new WorkflowsCollection({ id: 'Task' });
            this.workflowsCollection.bind('reset', this.render, this);
            this.collection = options.collection;
        },
        filterByWorkflow : function(id) {
            return this.collection.filter(function (data) {
                return data.get("workflow")._id == id;
            });
        },
        
        render: function () {
            var workflows = this.workflowsCollection.toJSON();
            this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));
            var models = this.collection.models;
            $(".column").last().addClass("lastColumn");
            _.each(workflows, function (workflow, i) {
                var counter = 0,
                remaining = 0;
                var column = this.$(".column").eq(i);
                var kanbanItemView;
                var modelByWorkflows = this.filterByWorkflow(workflow._id);
                _.each(modelByWorkflows, function (wfModel) {
                    kanbanItemView = new TasksKanbanItemView({ model: wfModel });
                    column.append(kanbanItemView.render().el);
                    counter++;
                    remaining += wfModel.get("remaining");

                }, this);
                var count = " <span>(<span class='counter'>" + counter + "</span>)</span>";
                var content = "<p class='remaining'>Remaining time: <span>" + remaining + "</span></p>";
                column.find(".columnNameDiv h2").append(count);
                column.find(".columnNameDiv").append(content);
            }, this);
            return this;
        }
    });
    return TaskKanbanView;
});