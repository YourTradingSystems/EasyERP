define([
    'text!templates/Tasks/kanban/WorkflowsTemplate.html',
    'text!templates/Tasks/kanbanSettings.html',
    'collections/Workflows/WorkflowsCollection',
    'views/Tasks/kanban/KanbanItemView',
    'views/Tasks/EditView',
    'views/Tasks/CreateView',
    'collections/Tasks/TasksCollection',
    'models/TasksModel',
    'dataService',
	'populate'
],
    function (WorkflowsTemplate, kanbanSettingsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, TasksCollection, CurrentModel, dataService, populate) {
        var collection = new TasksCollection();
        var TasksKanbanView = Backbone.View.extend({
            el: '#content-holder',
            events: {
                "dblclick .item": "gotoEditForm",
                "click .item": "selectItem",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect"
            },

            columnTotalLength: null,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.workflowsCollection = options.workflowCollection;
                this.render();
                this.asyncFetch(options.workflowCollection, options.parrentContentId);
                this.getCollectionLengthByWorkflows(this, options.parrentContentId);
                this.responseObj = {};
            },
            notHide: function (e) {
                return false;
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true)
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false)
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelectPriority(e, prev, next, this);
                return false;

            },

            hideNewSelect: function (e) {
                $(".newSelectList").hide();
            },

            chooseOption: function (e) {
                $(e.target).parents(".taskSelect").find(".current-selected").text($(e.target).text());
                var id = $(e.target).parents(".taskSelect").find(".current-selected").attr("id").replace("priority", "");
                var obj = collection.get(id);
                var extr = obj.get('extrainfo');
                if (extr.customer == "") {
                    extr.customer = null
                }
                extr.priority = $(e.target).parents(".taskSelect").find(".current-selected").text();
                obj.set({ "extrainfo": extr });
                obj.save({}, {
                    headers: {
                        mid: 39
                    },
                    success: function () {
                    }
                });

                this.hideNewSelect();
                return false;
            },

            isNumberKey: function (evt) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false;
                return true;
            },

            saveKanbanSettings: function () {
                var countPerPage = $(this).find('#cPerPage').val();
                var id = window.location.hash.split('/')[3];
                var url = (id && id.length === 24) ? "easyErp/Tasks/kanban/" + id : "easyErp/Tasks"; 
                dataService.postData('/currentUser', { 'kanbanSettings.tasks.countPerPage': countPerPage }, function (seccess, error) {
                    if (seccess) {
                        $(".edit-dialog").remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, { trigger: true });
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            editKanban: function (e) {
                dataService.getData('/currentUser', null, function (user, context) {
                    var tempDom = _.template(kanbanSettingsTemplate, { tasks: user.kanbanSettings.tasks });
                    context.$el = $(tempDom).dialog({
                        dialogClass: "edit-dialog",
                        width: "400",
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
                        var column = context.$el.find("#" + object._id);
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
                    success: function (model) {
                        new EditView({ model: model });
                    },
                    error: function () { alert('Please refresh browser'); }
                });
            },

            asyncFetch: function (workflows, parrentContentId) {
                _.each(workflows.toJSON(), function (wfModel) {
                    dataService.getData('/Tasks/kanban', { workflowId: wfModel._id, parrentContentId: parrentContentId }, this.asyncRender, this);
                }, this);
            },

            asyncRender: function (response, context) {
                var contentCollection = new TasksCollection();
                contentCollection.set(contentCollection.parse(response));
                if (collection) {
                    collection.add(contentCollection.models);
                } else {
                    collection = new TasksCollection();
                    collection.set(collection.parse(response));
                }
                var kanbanItemView;
                var column = context.$el.find("#" + response.workflowId);
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
                    itemCount = 0;
                    var column = this.$(".column").eq(i);
                    var count = " <span>(<span class='counter'>" + itemCount + "</span> / </span>";
                    var total = " <span><span class='totalCount'>" + itemCount + "</span> )</span>";
                    var remaining = " <span><span class='remaining'>" + itemCount + "</span> </span>";
                    column.find(".columnNameDiv h2").append(count).append(total).append(remaining);
                }, this);
                populate.getPriority("#priority", this);

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
                        if (model) {
                            model.set({ workflow: column.attr('id'), workflowForKanban: true });
                            model.save({}, { validate: false });
                            column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                            column.find(".totalCount").html(parseInt(column.find(".totalCount").html()) + 1);
                            column.find(".remaining").html(parseInt(column.find(".remaining").html()) + parseInt(model.get('remaining')));
                        }
                    }
                }).disableSelection();
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
                $(document).on("keypress", "#cPerPage", this.isNumberKey);
                return this;
            }
        });

        return TasksKanbanView;
    });
