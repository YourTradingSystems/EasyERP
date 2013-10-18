define([
    'text!templates/Leads/list/ListTemplate.html',
    'text!templates/Leads/form/FormTemplate.html',
    'collections/Leads/LeadsCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/Leads/list/ListItemView',
    'custom'

],
function (ListTemplate, FormTemplate, LeadsCollection, WorkflowsCollection, ListItemView, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Leads View');
            this.workflowsCollection = new WorkflowsCollection({ id: 'lead' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click #tabList a": "switchTab",
            "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow"
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

        changeWorkflow: function (e) {
            var mid = 39;

            var breadcrumb = $(e.target).closest('li');
            var a = breadcrumb.siblings().find("a");
            var button = breadcrumb.closest(".breadcrumb").siblings();
            var name, status;

            if (a.hasClass("active")) {
                a.removeClass("active");
            }
            breadcrumb.find("a").addClass("active");

            if (breadcrumb.is(':last-child')) {
                button.hide();
                button.last().show();
            }
            else {
                button.show();
                button.last().hide();
            }
            if ($(e.target).hasClass("applicationWorkflowLabel")) {
                name = breadcrumb.data("name");
                status = breadcrumb.data("status");
            }
            else {
                var workflow = {};
                if ($(e.target).attr("id") == "cancelCase") {
                    workflow = this.workflowsCollection.models[this.workflowsCollection.models.length - 1];
                }
                else {
                    workflow = this.workflowsCollection.models[0];
                }
                name = workflow.get('name');
                status = workflow.get('status');
            }
            var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
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
            //model.on('change', this.render, this);
        },

        render: function () {
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Leads View');
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
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                            currentModel.on('change', this.render, this);
                            var workflows = this.workflowsCollection.models;
                            _.each(workflows, function (workflow, index) {
                                $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                            });

                            _.each(workflows, function (workflow, i) {
                                var breadcrumb = this.$(".breadcrumb li").eq(i);
                                if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                                    breadcrumb.find("a").addClass("active");
                                    var button = breadcrumb.closest(".breadcrumb").siblings();
                                    if (breadcrumb.is(':last-child')) {
                                        button.hide();
                                        button.last().show();
                                    }
                                    else {
                                        button.show();
                                        button.last().hide();
                                    }
                                }
                            }, this);
                        }

                        break;
                    }
            }

            return this;

        },

        checked: function (event) {
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
                                }
                            },
                                { wait: true }
                            );
                        });

                        this.collection.trigger('reset');
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
                            }
                        },
                        { wait: true }

                        );
                        this.collection.trigger('reset');
                        if (this.collection.length != 0) {
                            Backbone.history.navigate("#home/content-Leads/form/" + itemIndex, { trigger: true });
                        } else {
                            Backbone.history.navigate("#home/content-Leads", { trigger: true });
                        }
                        break;
                    }
            }

        }
    });

    return ContentView;
});
