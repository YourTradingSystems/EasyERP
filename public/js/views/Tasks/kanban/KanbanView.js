define([
        'text!templates/Tasks/kanban/WorkflowsTemplate.html',
        'collections/Workflows/WorkflowsCollection',
        'views/Tasks/kanban/KanbanItemView',
        'views/Tasks/EditView',
        'views/Tasks/CreateView'
],
function (WorkflowsTemplate, WorkflowsCollection, TasksKanbanItemView, EditView, CreateView) {
    var TaskKanbanView = Backbone.View.extend({
        el: '#content-holder',
        events: {
            "click #showMore": "showMore",
            "dblclick .task-header, .task-content": "gotoEditForm",
            "click .task-header, .task-content": "selectItem"
        },
        initialize: function (options) {
            this.workflowsCollection = new WorkflowsCollection({ id: 'Task' });
            this.workflowsCollection.bind('reset', this.render, this);
            this.collection = options.collection;

            taskCounter = [];
            taskRemaining = [];
            elseTaskModels = [];
        },
        
        selectItem: function (e) {
			$(e.target).parents(".item").parents("table").find(".active").removeClass("active");
			$(e.target).parents(".item").addClass("active");
        },

        gotoEditForm: function (e) {
            e.preventDefault();
            var id = $(e.target).closest(".item").data("id");
            var model = this.collection.getElement(id);
            new EditView({ model: model, collection: this.collection });
        },
        
        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },
        showMoreContent: function (newModels) {
            var columnLimit = this.collection.columnLimit;
            var columnCounter = [];
            var workflows = this.workflowsCollection.toJSON();
            this.collection.add(newModels.models);
            $(".column").last().addClass("lastColumn");

            var hideShowMore = true;
            if (newModels.length > workflows.length*columnLimit) {
                hideShowMore = false;
                newModels.splice(newModels.length-1,1);
            }

            _.each(workflows, function (workflow, i) {
                var column = this.$(".column").eq(i);
                var kanbanItemView;
                columnCounter[i] = [];
                taskCounter[i] = 0;
                taskRemaining[i] = 0;
                var modelByWorkflows = newModels.filterByWorkflow(workflow._id);

                if (elseTaskModels.length>0) {
                    for (var j=0; j<elseTaskModels.length; j++) {
                        var wfId = elseTaskModels[j].get('workflow')._id;
                        if (wfId == workflow._id) {
                            if (columnCounter[i].length < columnLimit) {
                                columnCounter[i].push(workflow._id);
                                kanbanItemView = new TasksKanbanItemView({ model: elseTaskModels[j] });
                                column.append(kanbanItemView.render().el);
                                taskCounter[i]++;
                                taskRemaining[i] = parseFloat(taskRemaining[i]) + elseTaskModels[j].get("remaining");
                                elseTaskModels.splice(j,1);
                                j--;
                            }
                        }
                    }
                }

                _.each(modelByWorkflows, function (wfModel) {
                        if (columnCounter[i].length < columnLimit) {
                            columnCounter[i].push(workflow._id);
                            kanbanItemView = new TasksKanbanItemView({ model: wfModel });
                            column.append(kanbanItemView.render().el);
                            taskCounter[i]++;
                            taskRemaining[i] += wfModel.get("remaining");
                        } else {
                            elseTaskModels.push(wfModel);
                        }

                }, this);
                column.find(".counter").html(parseInt(column.find(".counter").html()) + taskCounter[i]);
                column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) + taskRemaining[i]);
            }, this);

            if (elseTaskModels.length > 0) {
                hideShowMore = false;
            }
            if (hideShowMore) {
                $('#showMoreDiv').hide();
            }


        },

        editItem: function () {
            //create editView in dialog here
            new EditView({ collection: this.collection });
        },

        createItem: function () {
            //create editView in dialog here
            new CreateView();
        },

        render: function () {
            var columnLimit = this.collection.columnLimit;
            var columnCounter = [];

            var workflows = this.workflowsCollection.toJSON();
            this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));
            $(".column").last().addClass("lastColumn");

            var hideShowMore = true;
            if (this.collection.models.length > workflows.length*columnLimit) {
                hideShowMore = false;
                this.collection.models.splice(this.collection.models.length-1,1);
            }
            _.each(workflows, function (workflow, i) {
                columnCounter[i] = [];
                taskCounter[i] = 0;
                taskRemaining[i] = 0;

                var column = this.$(".column").eq(i);
                var kanbanItemView;
                var modelByWorkflows = this.collection.filterByWorkflow(workflow._id);


                _.each(modelByWorkflows, function (wfModel,n) {
                    if (columnCounter[i].length < columnLimit) {
                        columnCounter[i].push(workflow._id);
                        kanbanItemView = new TasksKanbanItemView({ model: wfModel });
                        column.append(kanbanItemView.render().el);
                        taskCounter[i]++;
                        taskRemaining[i] = parseFloat(taskRemaining[i]) + wfModel.get("remaining");
                    } else {
                        elseTaskModels.push(wfModel);
                    }

                }, this);
                var count = " <span>(<span class='counter'>" + taskCounter[i] + "</span>)</span>";
                var content = "<p class='remaining'>Remaining time: <span>" + taskRemaining[i] + "</span></p>";
                column.find(".columnNameDiv h2").append(count);
                column.find(".columnNameDiv").append(content);
            }, this);
            var that = this;

            if (elseTaskModels.length > 0) {
                hideShowMore = false;
            }

            if (!hideShowMore) {
                this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
            }

            this.$(".column").sortable({
                connectWith: ".column",
                cancel: "h2",
                cursor: "move",
                items: ".item",
                opacity: 0.7,
                revert: true,
                helper: 'clone',
                start: function (event, ui) {
                    var column = ui.item.closest(".column");
                    var id = ui.item.attr('data-id');
                    var model = that.collection.get(id);
                    if (model) {
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - (model.get("estimated") - model.get("logged")));
                    }

                },
                stop: function (event, ui) {
                    debugger;
                    var id = ui.item.attr('data-id');
                    var model = that.collection.get(id);
                    var column = ui.item.closest(".column");
                    if (model) {
                        model.set({ workflow: column.data('id') });
                        model.save({}, {
                            //headers: {
                            //    mid: mid
                            //}
                        });
                        column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                        column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) + (model.get("estimated") - model.get("logged")));
                    }
                }
            }).disableSelection();
            return this;
        }
    });

    return TaskKanbanView;
});
