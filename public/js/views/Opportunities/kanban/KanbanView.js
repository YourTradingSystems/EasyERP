define([
        'text!templates/Tasks/kanban/WorkflowsTemplate.html',
        'collections/Workflows/WorkflowsCollection',
        'views/Opportunities/kanban/KanbanItemView',
        'views/Opportunities/EditView',
        'views/Opportunities/CreateView',
        'collections/Companies/CompaniesCollection'
],
function (WorkflowsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView,CompaniesCollection) {
    var OpportunitiesKanbanView = Backbone.View.extend({
        el: '#content-holder',
        events: {
            "click #showMore": "showMore",
            "dblclick .item": "gotoEditForm",
            "click .item": "selectItem"
        },
        initialize: function (options) {
        	this.render = _.after(2, this.render);
        	this.workflowsCollection = new WorkflowsCollection({ id: 'Opportunity' });
            this.workflowsCollection.bind('reset', this.render, this);
            this.companiesCollection = new CompaniesCollection();
            this.companiesCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
        },
        
        selectItem: function (e) {
			$(e.target).parents(".item").parents("table").find(".active").removeClass("active");
			$(e.target).parents(".item").addClass("active");
        },

        gotoEditForm: function (e) {
            e.preventDefault();
            var id = $(e.target).closest(".inner").data("id");
            var model = this.collection.getElement(id);
            new EditView({ model: model, collection: this.collection });
        },
        
        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },

        showMoreContent: function (newModels) {
            var workflows = this.workflowsCollection.toJSON();
            this.collection.set(newModels.models);
            $(".column").last().addClass("lastColumn");
            _.each(workflows, function (workflow, i) {
                var counter = 0,
                remaining = 0;
                var column = this.$(".column").eq(i);
                var kanbanItemView;
                var modelByWorkflows = newModels.filterByWorkflow(workflow._id);
                _.each(modelByWorkflows, function (wfModel) {
                    kanbanItemView = new TasksKanbanItemView({ model: wfModel });
                    column.append(kanbanItemView.render().el);
                    counter++;
                    //remaining += wfModel.get("remaining");
                }, this);
                column.find(".counter").html(parseInt(column.find(".counter").html()) + counter);
                //column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) + remaining);
            }, this);
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
            var workflows = this.workflowsCollection.toJSON();
            this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));
            $(".column").last().addClass("lastColumn");
            _.each(workflows, function (workflow, i) {
                var counter = 0,
                remaining = 0;
                var column = this.$(".column").eq(i);
                var kanbanItemView;
                var modelByWorkflows = this.collection.filterByWorkflow(workflow._id);
                _.each(modelByWorkflows, function (wfModel) {
                	
                	var comID = (wfModel.get("customer")) ? wfModel.get("customer").company : null;
                	var companies = (comID) ? this.companiesCollection.get(comID).toJSON() : null;
                    kanbanItemView = new KanbanItemView({ model: wfModel, companies: companies });
                    column.append(kanbanItemView.render().el);
                    counter++;
                    //remaining += wfModel.get("remaining");

                }, this);
                var count = " <span>(<span class='counter'>" + counter + "</span>)</span>";
                /*var content = "<p class='remaining'>Remaining time: <span>" + remaining + "</span></p>";*/
                column.find(".columnNameDiv h2").append(count);
                //column.find(".columnNameDiv").append(content);
            }, this);
            var that = this;
            this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
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
                    var id = ui.item.context.id;
                    var model = that.collection.get(id);
                    if (model) {
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        //column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - (model.get("estimated") - model.get("logged")));
                    }

                },
                stop: function (event, ui) {
                	var id = ui.item.context.id;
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
                        //column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) + (model.get("estimated") - model.get("logged")));
                    }
                }
            }).disableSelection();
            return this;
        }
    });

    return OpportunitiesKanbanView;
});
