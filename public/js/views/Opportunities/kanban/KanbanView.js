define([
        'text!templates/Tasks/kanban/WorkflowsTemplate.html',
        'collections/Workflows/WorkflowsCollection',
        'views/Opportunities/kanban/KanbanItemView',
        'views/Opportunities/EditView',
        'views/Opportunities/CreateView',
        'collections/Companies/CompaniesCollection',
        'models/OpportunitiesModel'
],
function (WorkflowsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, CompaniesCollection, CurrentModel) {
    var OpportunitiesKanbanView = Backbone.View.extend({
        el: '#content-holder',
        events: {
            "click #showMore": "showMore",
            "dblclick .item": "gotoEditForm",
            "click .item": "selectItem"
        },
        initialize: function (options) {
        	//this.render = _.after(2, this.render);
        	this.workflowsCollection = new WorkflowsCollection({ id: 'Opportunity' });
            this.workflowsCollection.bind('reset', this.render, this);
            //this.companiesCollection = new CompaniesCollection();
            //this.companiesCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
        },
        
        selectItem: function (e) {
			$(e.target).parents(".item").parents("table").find(".active").removeClass("active");
			$(e.target).parents(".item").addClass("active");
        },

        gotoEditForm: function (e) {
            e.preventDefault();
            var id = $(e.target).closest(".inner").data("id");
            var model = new CurrentModel();
            model.urlRoot = '/Opportunities/form';
            model.fetch({
                data: { id: id },
                success: function (model, response, options) {
                    new EditView({ model: model });
                },
                error: function () { alert('Please refresh browser'); }
            });
        },
        
        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore();
        },

        showMoreContent: function (newModels) {
            var workflows = this.workflowsCollection.toJSON();

            $(".column").last().addClass("lastColumn");
            _.each(workflows, function (workflow, i) {
                var column = this.$(".column").eq(i);
                var kanbanItemView;
                var modelByWorkflows = newModels.filterByWorkflow(workflow._id);
                _.each(modelByWorkflows, function (wfModel) {
                    kanbanItemView = new KanbanItemView({ model: wfModel });
                    var model_id = wfModel.get('_id');
                    if (this.collection.get(model_id) === undefined) {
                        column.append(kanbanItemView.render().el);
                    } else {
                        $( "#"+ wfModel.get('_id')).hide();
                        column.append(kanbanItemView.render().el);
                    }
                }, this);
            }, this);
            this.collection.add(newModels.models);

            if (!this.collection.showMoreButton) {
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
            var workflows = this.workflowsCollection.toJSON();
            this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));
            $(".column").last().addClass("lastColumn");
            var OpportunitieCount;
           // var OpportunitieRemaining;

            _.each(workflows, function (workflow, i) {
                OpportunitieCount = 0
                //OpportunitieRemaining = 0;
                _.each(this.collection.optionsArray, function(wfId){
                    if (wfId._id == workflow._id) {
                        OpportunitieCount = wfId.count;
                        //OpportunitieRemaining = wfId.remainingOfOpportunitie;
                    }
                });
                var column = this.$(".column").eq(i);
                var kanbanItemView;
                var modelByWorkflows = this.collection.filterByWorkflow(workflow._id);

                _.each(modelByWorkflows, function (wfModel) {
                    kanbanItemView = new KanbanItemView({ model: wfModel});
                    column.append(kanbanItemView.render().el);
                }, this);
                var count = " <span>(<span class='counter'>" + OpportunitieCount + "</span>)</span>";
                /*var content = "<p class='remaining'>Remaining time: <span>" + remaining + "</span></p>";*/
                column.find(".columnNameDiv h2").append(count);
                //column.find(".columnNameDiv").append(content);
            }, this);
            var that = this;

            if (this.collection.showMoreButton) {
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
                    var id = ui.item.context.id;
                    var model = that.collection.get(id);
                    if (model) {
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        //column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - (model.get("estimated") - model.get("logged")));
                    }

                },
                stop: function (event, ui) {
                	var id = ui.item.context.id;
                    //var id = ui.item.attr('data-id');
                    var model = that.collection.get(id);
                    var column = ui.item.closest(".column");
                    if (model) {
                        model.set({ workflow: column.data('id'), workflowForKanban: true });
                        model.save({});

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
