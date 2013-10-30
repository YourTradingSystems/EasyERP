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
    "GanttChart"
],

function (TasksListTemplate, TasksFormTemplate, WorkflowsTemplate, WorkflowsCollection, ProjectsCollection, TasksThumbnailsItemView, TasksKanbanItemView, Custom, common, GanttChart) {
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
            this.render();
                
            $(window).resize(function () {
                that.$(".scroll-x").css("min-height", function () { var h = $(window).height() - 101; var height = h + 'px'; return height; });
                that.$(".column").css("height", function () { var h = $(".kanban").height(); var height = h + 'px'; return height; });
            });

        },

        events: {
            "click .checkbox": "checked",
            "click .foldUnfold": "openDropDown",
            "click .fold": "foldUnfoldColumn",
            "click .form p > a": "gotoProjectForm",
            "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
            "click #tabList a": "switchTab",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm"
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
            var itemIndex = $(e.target).closest("tr").data("index") + 1;
            window.location.hash = "#home/content-Tasks/form/" + itemIndex;
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
            var workflows = this.workflowsCollection.models;
            var projectId = window.location.hash.split('/')[3];
            if (!projectId || projectId.length < 24) {
                models = this.collection.models;
                App.projectId = null;
            }
            else {
                App.projectId = projectId;
                _.each(this.collection.models, function (item) {
                    if (item.get("project").id == projectId) models.push(item);
                }, this);
            }
            switch (viewType) {
                case "kanban":
                    {
                        this.$el.html(_.template(WorkflowsTemplate, {workflowsCollection:this.workflowsCollection.toJSON()}));

                        $(".column").last().addClass("lastColumn");

                        _.each(workflows, function (workflow, i) {                         
                            var counter = 0,
                                remaining = 0;
                            var column = this.$(".column").eq(i);
                            var kanbanItemView;
                            _.each(models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    kanbanItemView = new TasksKanbanItemView({ model: model });
                                    kanbanItemView.bind('deleteEvent', this.deleteItems, kanbanItemView);
                                    column.append(kanbanItemView.render().el);
                                    counter++;
                                    remaining += model.get("estimated") - model.get("logged");
                                }
                            }, this);
                            column.find(".columnNameDiv").append("<p class='counter'>" + counter + "</p><a class='foldUnfold' href='#'><img hidden='hidden' src='./images/downCircleBlack.png'/></a><ul hidden='hidden' class='dropDownMenu'></ul><p class='remaining'>Remaining time: <span>" + remaining + "</span></p>");
                        }, this);
                        break;
                    }
                case "list":
                    {
                        var jsonCollection = this.collection.toJSON();
                        /*$.each(jsonCollection, function(index,value){
                            value.extrainfo.StartDate = common.utcDateToLocaleDate(value.extrainfo.StartDate);
                            value.extrainfo.EndDate = common.utcDateToLocaleDate(value.extrainfo.EndDate);
                        });*/
                        this.$el.html(_.template(TasksListTemplate, {tasksCollection:jsonCollection}));

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
                            var thumbnailsItemView;
                            _.each(models, function (model) {
                                thumbnailsItemView = new TasksThumbnailsItemView({ model: model });
                                thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                                $(holder).append(thumbnailsItemView.render().el);
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

                            var extrainfo = currentModel.get('extrainfo');
                            extrainfo['StartDate'] = (currentModel.get('extrainfo').StartDate) ? common.ISODateToDate(currentModel.get('extrainfo').StartDate) : '';
                            extrainfo['EndDate'] = (currentModel.get('extrainfo').EndDate) ? common.ISODateToDate(currentModel.get('extrainfo').EndDate) : '';
                            deadline = (currentModel.get('deadline')) ? common.ISODateToDate(currentModel.get('deadline')) : '';
                            //currentModel.set({ deadline: deadline, extrainfo: extrainfo }, { silent: true });

                            //currentModel.on('change', this.render, this);
                            //currentModel.set({ deadline: currentModel.get('deadline').split('T')[0].replace(/-/g, '/') }, { silent: true });
                            this.$el.html(_.template(TasksFormTemplate, currentModel.toJSON()));

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
                        this.$el.html('<div style=" height:570px; position:relative;" id="GanttDiv"></div>');
                        GanttChart.create("GanttDiv");
                        if (this.projectsCollection.length > 0)
                            GanttChart.parseTasks(this.projectsCollection);
                        break;
                    }
            }
           
            this.$(".scroll-x").css("height", function () { var h = $(window).height() - 101; var fh = h + 'px'; return fh });
           this.$(".column").css("height", function () { var h; h = $(".kanban").height(); var height = h + 'px'; console.log(height); return height; });
            this.$(".kanban").width((this.$(".column").width() + 1) * workflows.length);
           
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
            common.contentHolderHeightFixer();
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
                        model = that.collection.get(this.$el.attr("id"));
                        var remaining = model.get("estimated") - model.get("loged");
                        this.$("#delete").closest(".task").fadeToggle(300, function () {
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
                        this.collection.trigger('reset');
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
                        this.$el.fadeToggle(300, function () {
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
