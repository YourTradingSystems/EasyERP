define([
    'jqueryui',
    'text!templates/Tasks/list/ListTemplate.html',
    'text!templates/Tasks/form/FormTemplate.html',
    'text!templates/Tasks/kanban/KanbanTemplate.html',
    'collections/Tasks/TasksCollection',
    'collections/Workflows/WorkflowsCollection',
    'collections/Projects/ProjectsCollection',
    'views/Tasks/list/ListItemView',
    'views/Tasks/thumbnails/ThumbnailsItemView',
    'views/Tasks/kanban/KanbanItemView',
    'custom',
    "GanttChart"
],

function (jqueryui, TasksListTemplate, TasksFormTemplate, TasksKanbanTemplate, TasksCollection, WorkflowsCollection, ProjectsCollection, TasksListItemView, TasksThumbnailsItemView, TasksKanbanItemView, Custom, GanttChart) {
    var TasksView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            var that = this;
            this.workflowsCollection = new WorkflowsCollection({ id: 'task' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.projectsCollection = new ProjectsCollection();
            this.projectsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            //this.render();

            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resizeEnd');
                }, 1000);
            });

            $(window).bind('resizeEnd', function () {
                that.$(".kanban").height(that.$el.siblings("#leftmenu-holder").height() - that.$el.siblings("#top-bar").height());
            });

        },

        events: {
            "click .checkbox": "checked",
            "click .foldUnfold": "openDropDown",
            "click .fold": "foldUnfoldColumn",
            "click .form p > a": "gotoProjectForm",
            "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
            "click #tabList a": "switchTab"
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

        gotoProjectForm: function (e) {
            e.preventDefault();
            var itemIndex = this.projectsCollection.indexOf(this.projectsCollection.get($(e.target).closest("a").attr("id"))) + 1;
            window.location.hash = "#home/content-Projects/form/" + itemIndex;
        },

        render: function () {
            var that = this;
            Custom.setCurrentCL(this.collection.models.length);
            var viewType = Custom.getCurrentVT();
            var mid = 39;
            var models = [];
            var projectId = window.location.hash.split('/')[3];
            if (!projectId || projectId.length < 24) {
                models = this.collection.models;
            }
            else {
                _.each(this.collection.models, function (item) {
                    if (item.get("project").pId == projectId) models.push(item)
                }, this);
            }
            switch (viewType) {
                case "kanban":
                    {
                        var workflows = this.workflowsCollection.models;
                        this.$el.html(_.template(TasksKanbanTemplate));
                        _.each(workflows, function (workflow, index) {
                            $("<div class='column' data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><div class='columnNameDiv'><h2 class='columnName'>" + workflow.get('name') + "</h2></div></div>").appendTo(".kanban");
                        });

                        $(".column").last().addClass("lastColumn");

                        _.each(workflows, function (workflow, i) {
                            var counter = 0,
                                remaining = 0;
                            var column = this.$(".column").eq(i);
                            _.each(models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    column.append(new TasksKanbanItemView({ model: model }).render().el);
                                    counter++;
                                    remaining += model.get("estimated") - model.get("loged");
                                }
                            }, this);
                            column.find(".columnNameDiv").append("<p class='counter'>" + counter + "</p><a class='foldUnfold' href='#'><img hidden='hidden' src='./images/downCircleBlack.png'/></a><ul hidden='hidden' class='dropDownMenu'></ul><p class='remaining'>Remaining time: <span>" + remaining + "</span></p>");
                        }, this);
                        break;
                    }
                case "list":
                    {
                        this.$el.html('');
                        this.$el.html(_.template(TasksListTemplate));
                        if (models.length > 0) {
                            var table = this.$el.find('table > tbody');
                            _.each(models, function (model) {
                                table.append(new TasksListItemView({ model: model }).render().el);
                            }, this);
                        }

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html('');
                        if (models.length > 0) {
                            var holder = this.$el;
                            _.each(models, function (model) {
                                $(holder).append(new TasksThumbnailsItemView({ model: model }).render().el);
                            }, this);
                        } else {
                            this.$el.html('<h2>No tasks found</h2>');
                        }
                        break;
                    }
                case "form":
                    {
                        this.$el.html('');
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > models.length - 1) {
                            itemIndex = models.length - 1;

                            var urlParts = window.location.hash.split('/');
                            if (urlParts[4]) {
                                urlParts[4] = models.length;
                                window.location.hash = urlParts.join('/');
                            }
                            Custom.setCurrentII(models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html('<h2>No tasks found</h2>');
                        } else {
                            var currentModel = models[itemIndex];
                            currentModel.on('change', this.render, this);
                            console.log(currentModel);
                            //currentModel.set({ deadline: currentModel.get('deadline').split('T')[0].replace(/-/g, '/') }, { silent: true });
                            this.$el.html(_.template(TasksFormTemplate, currentModel.toJSON()));

                            var workflows = this.workflowsCollection.models;
                            var that = this;
                            _.each(workflows, function (workflow, index) {
                                if (index < workflows.length - 2) {
                                    $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                                }
                            });

                            _.each(workflows, function (workflow, i) {
                                var breadcrumb = this.$(".breadcrumb li").eq(i);
                                if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                                    breadcrumb.find("a").addClass("active");
                                }
                            }, this);
                        }

                        break;
                    }

                case "gantt":
                    {
                        if (this.projectsCollection.length > 0) {
                            this.$el.html('');
                            this.$el.html('<div style=" height:570px;"  id="GanttDiv"></div>');
                            GanttChart.create("GanttDiv");
                            GanttChart.parseTasks(this.projectsCollection);
                        }
                        break;
                    }
            }
            this.$(".kanban").height(this.$el.siblings("#leftmenu-holder").height() - this.$el.siblings("#top-bar").height());
            this.$(".column").sortable({
                connectWith: ".column",
                cancel: "h2",
                cursor: "move",
                items: ".task",
                opacity: 0.7,
                revert: true,
                helper: 'clone',
                start: function (event, ui) {
                    var column = ui.item.closest(".column");
                    var model = that.collection.get(ui.item.attr("id"));
                    column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                    column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - (model.get("estimated") - model.get("loged")));
                },
                stop: function (event, ui) {
                    var model = that.collection.get(ui.item.attr("id"));
                    var column = ui.item.closest(".column");
                    var ob = {
                        workflow: {
                            name: column.data("name"),
                            status: column.data("status")
                        }
                    };

                    model.set(ob);
                    model.save({}, {
                        headers: {
                            mid: mid
                        }

                    });
                    column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                    column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) + (model.get("estimated") - model.get("loged")));
                }
            }).disableSelection();
            return this;
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
                var workflow = {};
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

        checked: function (event) {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteSingleItem: function () {

        },

        deleteItems: function () {
            var that = this,
        		mid = 39;

            $.each($("tbody input:checked"), function (index, checkbox) {
                var task = that.collection.get(checkbox.value);

                task.destroy({
                    headers: {
                        mid: mid
                    }
                },
        		{ wait: true }
        		);
            });

            this.collection.trigger('reset');
        }
    });

    return TasksView;
});
