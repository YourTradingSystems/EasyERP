define([
    'text!templates/Tasks/kanban/WorkflowsTemplate.html',
    'text!templates/Tasks/kanbanSettings.html',
    'collections/Workflows/WorkflowsCollection',
    'views/Tasks/kanban/KanbanItemView',
    'views/Tasks/EditView',
    'views/Tasks/CreateView',
    'collections/Tasks/TasksCollection',
    'models/TasksModel',
    'dataService'
],
    function (WorkflowsTemplate, kanbanSettingsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, TasksCollection, CurrentModel, dataService) {
        var collection = new TasksCollection();
        var TasksKanbanView = Backbone.View.extend({
            el: '#content-holder',
            events: {
                "dblclick .item": "gotoEditForm",
                "click .item": "selectItem"
            },

            columnTotalLength: null,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.workflowsCollection = options.workflowCollection;
                this.render();
                this.asyncFetc(options.workflowCollection, options.parrentContentId);
                this.getCollectionLengthByWorkflows(this, options.parrentContentId);
            },

            saveKanbanSettings: function () {
                var countPerPage = $(this).find('#cPerPage').val();
                dataService.postData('/currentUser', { 'kanbanSettings.tasks.countPerPage': countPerPage }, function (seccess, error) {
                    if (seccess) {
                        $(".edit-dialog").remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate("easyErp/Tasks", { trigger: true });
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            editKanban: function(e){
                dataService.getData('/currentUser', null, function (user, context) {
                    var tempDom = _.template(kanbanSettingsTemplate, { tasks: user.kanbanSettings.tasks });
                    context.$el = $(tempDom).dialog({
                        dialogClass: "edit-dialog",
                        width: "900",
                        title: "Edit Kanban Settings",
                        buttons: {
                            save: {
                                text: "Save",
                                class: "btn",
                                click: context.saveKanbanSettings
                            },
                            cancel: {
                                text: "Cancel",
                                class: "btn",
                                click: function () {
                                    context.hideDialog();
                                }
                            }
                        }
                    });
                }, this);
            },

            getCollectionLengthByWorkflows: function (context, parrentContentId) {
                dataService.getData('/getTasksLengthByWorkflows', { parrentContentId: parrentContentId }, function (data) {
                    data.arrayOfObjects.forEach(function (object) {
                        var column = context.$("[data-id='" + object._id + "']");
                        column.find('.totalCount').text(object.count);
                        column.find('.remaining').text(object.remaining);
                    });
                    if (data.showMore) {
                        context.$el.append('<div id="showMoreDiv" title="To show mor ellements per column, please change kanban settings">And More</div>');
                    }
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
                model.urlRoot = '/Tasks/form';
                model.fetch({
                    data: { id: id },
                    success: function (model, response, options) {
                        new EditView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
            },

            asyncFetc: function (workflows, parrentContentId) {
                _.each(workflows.toJSON(), function (wfModel) {
                    dataService.getData('/Tasks/kanban', { workflowId: wfModel._id, parrentContentId: parrentContentId }, this.asyncRender, this);
                }, this);
            },

            asyncRender: function (response, context) {
                console.log(response.time);
                var contentCollection = new TasksCollection();
                contentCollection.set(contentCollection.parse(response));
                if (collection) {
                    collection.add(contentCollection.models);
                } else {
                    collection = new TasksCollection();
                    collection.set(collection.parse(response));
                }
                var kanbanItemView;
                var column = this.$("[data-id='" + response.workflowId + "']");
                column.find(".counter").html(parseInt(column.find(".counter").html()) + contentCollection.models.length);
                _.each(contentCollection.models, function (wfModel) {
                    kanbanItemView = new KanbanItemView({ model: wfModel });
                    var curEl = kanbanItemView.render().el;
                    column.append(curEl);
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
                var itemCount;
                _.each(workflows, function (workflow, i) {
                    itemCount = 0
                    var column = this.$(".column").eq(i);
                    var count = " <span>(<span class='counter'>" + itemCount + "</span> / </span>";
                    var total = " <span><span class='totalCount'>" + itemCount + "</span> )</span>";
                    var remaining = " <span><span class='remaining'>" + itemCount + "</span> </span>";
                    column.find(".columnNameDiv h2").append(count).append(total).append(remaining);
                }, this);

                this.$(".column").sortable({
                    connectWith: ".column",
                    cancel: "h2",
                    cursor: "move",
                    items: ".item",
                    opacity: 0.7,
                    revert: true,
                    helper: 'clone',

                    start: function (event, ui) {
                        var id = ui.item.context.id;
                        var model = collection.get(id);
                        var column = ui.item.closest(".column");
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".totalCount").html(parseInt(column.find(".totalCount").html()) - 1);
                        column.find(".remaining").html(parseInt(column.find(".remaining").html()) - parseInt(model.get('remaining')));
                    },

                    stop: function (event, ui) {
                        var id = ui.item.context.id;
                        var model = collection.get(id);
                        var column = ui.item.closest(".column");
                        console.log('--------------');
                        console.log(id);
                        console.log(model);
                        if (model) {
                            model.set({ workflow: column.data('id'), workflowForKanban: true  });
                            model.save({},{validate: false});
                            column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                            column.find(".totalCount").html(parseInt(column.find(".totalCount").html()) + 1);
                            column.find(".remaining").html(parseInt(column.find(".remaining").html()) + parseInt(model.get('remaining')));
                        }
                    }
                }).disableSelection();
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
                return this;
            }
        });

        return TasksKanbanView;
    });
