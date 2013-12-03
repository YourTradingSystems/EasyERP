define([
    'text!templates/Tasks/list/ListTemplate.html',
    'text!templates/Tasks/form/FormTemplate.html',
    'text!templates/Tasks/kanban/WorkflowsTemplate.html',
    'collections/Workflows/WorkflowsCollection',
    'collections/Projects/ProjectsCollection',
    'views/Tasks/thumbnails/ThumbnailsItemView',
    'views/Tasks/kanban/KanbanItemView',
    'custom',
    'common',
    "GanttChart",
    'views/Tasks/EditView',
    'views/Tasks/CreateView'
],

function (TasksListTemplate, TasksFormTemplate, WorkflowsTemplate, WorkflowsCollection, ProjectsCollection, TasksThumbnailsItemView, TasksKanbanItemView, Custom, common, GanttChart, EditView, CreateView) {
    var TasksView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.renderView = _.after(2, this.render);
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.start = new Date();
            this.workflowsCollection = new WorkflowsCollection({ id: 'Task' });
            this.workflowsCollection.bind('reset', _.bind(this.renderView, this));
            this.projectsCollection = new ProjectsCollection();
            this.projectsCollection.bind('reset', _.bind(this.renderView, this));

        },

        events: {
            "click .checkbox": "checked",
            "click .foldUnfold": "openDropDown",
            "click .fold": "foldUnfoldColumn",
            "click .form dd > a": "gotoProjectForm",
            "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
            "click #tabList a": "switchTab",
            "click  .list td:not(:has('input[type='checkbox']'))": "gotoForm"
        },
        renderView: function(){  },

        render: function () {

            console.log('Tasks render');
            var that = this;
            //Custom.setCurrentCL(this.collection.models.length);
            var viewType = Custom.getCurrentVT();
            var mid = 39;
            var models = [];
            var workflows = this.workflowsCollection.toJSON();
            var projectId = window.location.hash.split('/')[4];
            if (!projectId || projectId.length < 24) {
                models = this.collection;
                App.hash = null;
            }
            else {
                App.hash = projectId;
                models = this.collection.filterByProject(projectId);
                /*_.each(this.collection.models, function (item) {
                    if (item.get("project").id == projectId) models.push(item);
                }, this);*/
            }
            switch (viewType) {
                case "kanban":
                {
                    //draw kanba header with workflows
                    var start = new Date();
                    this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));

                    $(".column").last().addClass("lastColumn");

                     _.each(workflows, function (workflow, i) {
                         var counter = 0,
                         remaining = 0;
                         var column = this.$(".column").eq(i);
                         var kanbanItemView;
                         var modelWorkflows = models.filterByWorkflow(workflow.name);
                         _.each(modelWorkflows, function (wfModel) {
                             kanbanItemView = new TasksKanbanItemView({ model: wfModel });
                             kanbanItemView.bind('deleteEvent', this.deleteItems, kanbanItemView);
                             column.append(kanbanItemView.render().el);
                             counter++;
                             remaining += wfModel.get("remaining");

                         }, this);
                         var count = " <span>(<span class='counter'>" + counter + "</span>)</span>";
                         var content = "<p class='remaining'>Remaining time: <span>" + remaining + "</span></p>";
                         column.find(".columnNameDiv h2").append(count);
                         column.find(".columnNameDiv").append(content);
                     }, this);
                    console.log("=========================Tasks -> Kanban: " + (new Date() - start)/1000 + " ms");
                    break;
                }
                case "list":
                {
                    var start = new Date();
                    this.$el.html(_.template(TasksListTemplate, { tasksCollection: models.toJSON() }));
                    console.log("=========================Persons -> list: " + (new Date() - start)/1000 + " ms");
                    $('#check_all').click(function () {
                        var c = this.checked;
                        $(':checkbox').prop('checked', c);
                    });
                    break;
                }
                case "thumbnails":
                {
                    var start = new Date();
                    this.$el.html('');
                    if (models.length > 0) {
                        var holder = this.$el;
                        var thumbnailsItemView;
                        _.each(models.models, function (model) {
                            thumbnailsItemView = new TasksThumbnailsItemView({ model: model });
                            thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                            $(holder).append(thumbnailsItemView.render().el);
                        }, this);
                    } else {
                        this.$el.html('<h2>No tasks found</h2>');
                    }
                    console.log("=========================Tasks -> Thumbnails: " + (new Date() - start)/1000 + " ms");
                    break;
                }
                case "form":
                {
                    this.$el.html('');
                    var currentModel = this.collection.getElement();
                    if (currentModel) {
                        var extrainfo = currentModel.get('extrainfo');
                        this.$el.html(_.template(TasksFormTemplate, currentModel.toJSON()));
                    } else {
                        this.$el.html('<h2>No tasks found</h2>');
                    }
                    break;
                }

                case "gantt":
                {
                    this.$el.html('<div style=" height:570px; position:relative;" id="GanttDiv"></div>');
                    GanttChart.create("GanttDiv");
                    if (this.projectsCollection.length > 0)
                        GanttChart.parseTasks(this.projectsCollection);
                    break;
                }
            }
            //this.$(".kanban").width((this.$(".column").width() + 10) * workflows.length);
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
                    if(model){
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - (model.get("estimated") - model.get("logged")));
                    }

                },
                stop: function (event, ui) {
                    var id = ui.item.attr('data-id');
                    var model = that.collection.get(id);
                    var column = ui.item.closest(".column");
                    if(model) {
                        model.set({ workflow: column.data('id') });
                        //model.get('workflow').status = column.data('status');

                        model.save({}, {
                            headers: {
                                mid: mid
                            }
                        });
                        column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                        column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) + (model.get("estimated") - model.get("logged")));
                    }
                }
            }).disableSelection();
            return this;
        },

        createItem: function(){
            //create editView in dialog here
            new CreateView();
        },

        editItem: function(){
            //create editView in dialog here
            new EditView({model:this.collection.getElement()});
        },

        switchTab: function (e) {
            e.preventDefault();
            var link = this.$("#tabList a");
            if (link.hasClass("selected")) {
                link.removeClass("selected");
            }
            var index = link.index($(e.target).addClass("selected"));
            this.$(".tab").hide().eq(index).show();
        },

        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").data("id");
            window.location.hash = "#home/content-Tasks/form/" + id;
        },

        gotoProjectForm: function (e) {
            e.preventDefault();
            var id = $(e.target).closest("a").attr("id");
            window.location.hash = "#home/content-Projects/form/" + id;
        },

        changeWorkflow: function (e) {
            var mid = 39;
            var model = {};
            var name = '', status = '';
            if ($(e.target).hasClass("applicationWorkflowLabel")) {
                var breadcrumb = $(e.target).closest('li');
                var a = breadcrumb.siblings().find("a");
                if (a.hasClass("active")) {
                    a.removeClass("active");
                }
                breadcrumb.find("a").addClass("active");
                name = breadcrumb.data("name");
                status = breadcrumb.data("status");
            }
            else {
                var workflow;
                if ($(e.target).closest("button").attr("id") == "Cancel") {
                    workflow = this.workflowsCollection.models[this.workflowsCollection.models.length - 1];
                }
                else {
                    workflow = this.workflowsCollection.models[this.workflowsCollection.models.length - 2];
                }
                name = workflow.get('name');
                status = workflow.get('status');
            }
            model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
            model.unbind('change');
            var ob = {
                workflow: {
                    name: name,
                    status: status
                }
            };

            model.set(ob);
            model.save({}, {
                headers: {
                    mid: mid
                }

            });

        },

        openDropDown: function (e) {
            e.preventDefault();
            var foldUnfold = "Unfold";
            if (!$(e.target).closest(".column").hasClass("rotate")) {
                foldUnfold = "Fold";
                $(e.target).closest(".columnNameDiv").toggleClass("selected");
            }
            $(e.target).closest(".foldUnfold").siblings(".dropDownMenu").html("<li><a class='fold' href='#'>" + foldUnfold + "</a></li>").fadeToggle("normal");
        },

        foldUnfoldColumn: function (e) {
            e.preventDefault();
            var column = $(e.target).closest(".column");
            if (column.hasClass("rotate")) {
                column.attr('style', '');
                column.find(".task, .remaining").show();
                column.find(".dropDownMenu").hide();
                column.find(".columnNameDiv");
                column.removeClass("rotate");
                column.find(".counter, .foldUnfold img").attr('style', '');
            } else {
                column.css('max-width', '40px');
                column.find(".task, .dropDownMenu, .remaining").hide();
                column.addClass("rotate");
                column.find(".columnNameDiv").removeClass("selected");
                column.find(".counter, .foldUnfold img").css({ 'position': 'relative', 'right': '6px', 'top': '-12px' });
            }

        },

        checked: function () {
            if (this.collection.length > 0) {
                if ($("input:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            }
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "kanban":
                    {
                        model = this.model;
                        var remaining = model.get("estimated") - model.get("logged");
                        this.$("#delete").closest(".task").fadeToggle(200, function () {
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                            $(this).remove();
                        });
                        var column = this.$el.closest(".column");
                        column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                        column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - remaining);
                        $('.popup').html(new Date() - start);
                        $('#popup-holder').fadeIn();
                        setTimeout(function(){
                            $('#popup-holder').fadeOut();
                            $('.popup').html('');

                        }, 3000);
                        break;
                    }
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = that.collection.get(checkbox.value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                        });

                        this.collection.trigger('reset');
                        break;
                    }
                case "thumbnails":
                    {
                        model = this.model.collection.get(this.$el.attr("id"));
                        this.$el.fadeToggle(200, function () {
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                            $(this).remove();
                        });
                        break;
                    }
                case "form":
                    {
                        model = this.collection.get($(".form-holder form").data("id"));
                        var itemIndex = this.collection.indexOf(model);
                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function (model) {
                                model = model.toJSON();
                                if (!model.project.id) {
                                    Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });

                                } else {
                                    Backbone.history.navigate("home/content-Tasks/kanban/" + model.project.id, { trigger: true });
                                }
                            }
                        });
                        break;
                    }
            }
        }
    });

    return TasksView;
});
