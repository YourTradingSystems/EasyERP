define([
    'text!templates/Projects/list/ListTemplate.html',
    'text!templates/Projects/form/FormTemplate.html',
    'collections/Workflows/WorkflowsCollection',
    'views/Projects/list/ListItemView',
    'views/Projects/thumbnails/ThumbnailsItemView',
    'custom',
    "GanttChart",
    'common'
],
function (ListTemplate, FormTemplate, WorkflowsCollection, ListItemView, ThumbnailsItemView, Custom, GanttChart, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Projects View');
            this.workflowsCollection = new WorkflowsCollection({ id: 'project' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
        },

        events: {
            "click .checkbox": "checked",
            "click .breadcrumb a": "changeWorkflow"
        },

        render: function () {
            var viewType = Custom.getCurrentVT(),
                models = this.collection.models;
            Custom.setCurrentCL(models.length);
            switch (viewType) {
                case "list":
                    {
                        this.$el.html('');
                        this.$el.html(_.template(ListTemplate));
                        if (this.collection.length > 0) {
                            var table = this.$el.find('table > tbody');
                            this.collection.each(function (model) {
                                table.append(new ListItemView({ model: model }).render().el);
                            });
                        } else {
                            this.$el.html('<h2>No projects found</h2>');
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
                        if (this.collection.length > 0) {
                            var holder = this.$el,
                                thumbnailsItemView;
                            _.each(models, function (model) {
                                thumbnailsItemView = new ThumbnailsItemView({ model: model });
                                thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                                $(holder).append(thumbnailsItemView.render().el);
                            }, this);
                        } else {
                            this.$el.html('<h2>No projects found</h2>');
                        }
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > models.length - 1) {
                            itemIndex = models.length - 1;
                            Custom.setCurrentII(models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html('<h2>No projects found</h2>');
                        } else {
                            var currentModel = models[itemIndex];
                            currentModel.on('change', this.render, this);
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                            var workflows = this.workflowsCollection.models;

                            _.each(workflows, function (workflow, index) {
                                $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
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
                        GanttChart.parseProjects(this.collection);

                        break;
                    }
            }
            common.contentHolderHeightFixer();
            return this;

        },

        changeWorkflow: function (e) {
            var mid = 39;
            var breadcrumb = $(e.target).closest('li');
            var a = breadcrumb.siblings().find("a");
            if (a.hasClass("active")) {
                a.removeClass("active");
            }
            breadcrumb.find("a").addClass("active");
            var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
            model.unbind('change');
            var ob = {
                workflow: {
                    name: breadcrumb.data("name"),
                    status: breadcrumb.data("status")
                }
            };

            model.set(ob);
            model.save({}, {
                headers: {
                    mid: mid
                }
            });

        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = that.collection.get(checkbox.value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                },
                                wait: true
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
                                },
                                wait: true
                            });
                            $(this).remove();
                        });
                        break;
                    }

                case "form":
                    {
                        model = this.collection.get($(".form-holder form").data("id"));
                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            wait: true,
                            success: function () {
                                Backbone.history.navigate("#home/content-Projects", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});