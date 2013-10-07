define([
    'text!templates/Projects/list/ListTemplate.html',
    'text!templates/Projects/form/FormTemplate.html',
    'collections/Workflows/WorkflowsCollection',
    'views/Projects/list/ListItemView',
    'views/Projects/thumbnails/ThumbnailsItemView',
    'custom',
    "GanttChart"
],
function (ListTemplate, FormTemplate, WorkflowsCollection, ListItemView, ThumbnailsItemView, Custom) {
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
            Custom.setCurrentCL(this.collection.models.length);
            var viewType = Custom.getCurrentVT();
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
                            var holder = this.$el;
                            this.collection.each(function (model) {
                                $(holder).append(new ThumbnailsItemView({ model: model }).render().el);
                            });
                        } else {
                            this.$el.html('<h2>No projects found</h2>');
                        }
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.models.length - 1) {
                            itemIndex = this.collection.models.length - 1;
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html('<h2>No projects found</h2>');
                        } else {
                            var currentModel = this.collection.models[itemIndex];
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
                        this.$el.html('');
                        this.$el.html('<div style=" height:570px; position:relative;" id="GanttDiv"></div>');
                        GanttChart.create("GanttDiv");
                        GanttChart.parseProjects(this.collection);
                        break;
                    }
            }

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

        checked: function (event) {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var self = this,
        		mid = 39;

            $.each($("tbody input:checked"), function (index, checkbox) {
                var project = self.collection.get(checkbox.value);
                project.destroy({
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

    return ContentView;
});
