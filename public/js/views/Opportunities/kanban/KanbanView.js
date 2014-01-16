define([
        'text!templates/Tasks/kanban/WorkflowsTemplate.html',
        'collections/Workflows/WorkflowsCollection',
        'views/Opportunities/kanban/KanbanItemView',
        'views/Opportunities/EditView',
        'views/Opportunities/CreateView',
        'collections/Opportunities/OpportunitiesCollection',
        'models/OpportunitiesModel',
        'dataService'
],
function (WorkflowsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, OpportunitiesCollection, CurrentModel, dataService) {
    var OpportunitiesKanbanView = Backbone.View.extend({
        el: '#content-holder',
        events: {
            "click #showMore": "showMore",
            "dblclick .item": "gotoEditForm",
            "click .item": "selectItem"
        },

        page: null,
        collection: null,
        columnTotalLength: null,
        showMoreButton: true,

        initialize: function (options) {
            this.page = 1;
            this.collection = new OpportunitiesCollection();
            this.workflowsCollection = options.workflowCollection;
            this.render();
            this.asyncFetc(options.workflowCollection);
            this.getCollectionLengthByWorkflows();
        },

        getCollectionLengthByWorkflows: function () {
            dataService.getData('/getLengthByWorkflows', {}, function (arrayOfObjects) {
                columnTotalLength = arrayOfObjects;
            });
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

        asyncFetc: function (workflows) {
            _.each(workflows.toJSON(), function (wfModel) {
                dataService.getData('/Opportunities/kanban', { workflowId: wfModel._id }, this.asyncRender);
            }, this);
        },

        asyncRender: function (response) {
            var contentCollection = new OpportunitiesCollection(response.data);
            if (this.collection) {
                this.collection.add(contentCollection.models);
            } else {
                this.collection = new OpportunitiesCollection(response.data);
            }
            var kanbanItemView;
            var column = this.$("[data-id='" + response.workflowId + "']");
            column.find(".counter").html(contentCollection.models.length);
            _.each(contentCollection.models, function (wfModel) {
                kanbanItemView = new KanbanItemView({ model: wfModel });
                var curEl = kanbanItemView.render().el;
                column.append(curEl);
            }, this);
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
                        $("#" + wfModel.get('_id')).hide();
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
            _.each(workflows, function (workflow, i) {
                OpportunitieCount = 0
                var column = this.$(".column").eq(i);
                var count = " <span>(<span class='counter'>" + OpportunitieCount + "</span>)</span>";
                column.find(".columnNameDiv h2").append(count);

            }, this);

            if (this.showMoreButton) {
                this.$el.append('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
            }

            var that = this;
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
                    column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                },
                
                stop: function (event, ui) {
                    var id = ui.item.context.id;
                    //var id = ui.item.attr('data-id');
                    var model = that.collection.get(id);
                    var column = ui.item.closest(".column");
                    if (model) {
                        model.set({ workflow: column.data('id') });
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
