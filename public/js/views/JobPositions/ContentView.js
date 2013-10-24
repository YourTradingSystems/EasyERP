define([
    'text!templates/JobPositions/list/ListTemplate.html',
    'text!templates/JobPositions/form/FormTemplate.html',
    'collections/JobPositions/JobPositionsCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/JobPositions/list/ListItemView',
    'custom',
    'common'

],
function (ListTemplate, FormTemplate, JobPositionsCollection, WorkflowsCollection, ListItemView, Custom, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init JobPositions View');
            this.workflowsCollection = new WorkflowsCollection({ id: 'jobposition' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            //this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click .breadcrumb a": "changeWorkflow"
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render JobPositions View');
            var viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate));
                        var table = this.$el.find('table > tbody');

                        this.collection.each(function (model) {
                            table.append(new ListItemView({ model: model }).render().el);
                        });

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
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
                            this.$el.html();
                        } else {
                            this.$el.html();
                            var currentModel = this.collection.models[itemIndex];
                            //currentModel.off('change');
                            //currentModel.on('change:workflow', _.bind(this.render, this));
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
                },
                wait: true
            });

        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var self = this,
                mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = self.collection.get(checkbox.value);
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
                                Backbone.history.navigate("#home/content-JobPositions", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
