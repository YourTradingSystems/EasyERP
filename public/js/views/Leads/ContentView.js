define([
    'text!templates/Leads/list/ListTemplate.html',
    'text!templates/Leads/form/FormTemplate.html',
    'collections/Leads/LeadsCollection',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Workflows/WorkflowsCollection',
    'custom',
    'common'
],
    function (ListTemplate, FormTemplate, LeadsCollection, OpportunitiesCollection, WorkflowsCollection, Custom, common) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                console.log('Init Leads View');
                this.workflowsCollection = new WorkflowsCollection({ id: 'lead' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.opportunitiesCollection = new OpportunitiesCollection();
                this.opportunitiesCollection.bind('reset', _.bind(this.render, this));
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
            },

            events: {
                "click .checkbox": "checked",
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow",
                "click #convertToOpportunity": "openDialog",
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            openDialog: function () {
                $("#dialog-form").dialog("open");
            },
            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).closest("tr").data("index") + 1;
                window.location.hash = "#home/content-Leads/form/" + itemIndex;
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
                var that = this;
                var mid = 39;
                switch (viewType) {
                    case "list":
                        {
                            this.$el.html(_.template(ListTemplate, {leadsCollection: this.collection.toJSON()}));

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
                                currentModel.off('change');
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
                            $("#dialog-form").dialog({
                                autoOpen: false,
                                height: 150,
                                width: 350,
                                modal: true,
                                title: "Convert to opportunity",
                                buttons: {
                                    "Create opportunity": function () {
                                        var self = this;
                                        var id = $("form").data("id");
                                        var model;
                                        var createCustomer = ($("select#createCustomerOrNot option:selected").val()) ? true : false;
                                        var itemIndex = 0;
                                        that.collection.unbind('reset');
                                        that.collection.fetch({
                                            success: function (collection) {
                                                model = collection.get(id);
                                                model.set({
                                                    isOpportunitie: true,
                                                    createCustomer: createCustomer
                                                });
                                                model.save({}, {
                                                    headers: {
                                                        mid: mid
                                                    },
                                                    success: function (model) {
                                                        $(self).dialog("close");
                                                        that.opportunitiesCollection.add(model);
                                                        itemIndex = that.opportunitiesCollection.indexOf(model) + 1;
                                                        Backbone.history.navigate("#home/content-Opportunities/form/" + itemIndex, { trigger: true });
                                                    }

                                                });
                                            }
                                        });
                                       

                                        //model.set({
                                        //    isOpportunitie: true,
                                        //    createCustomer: createCustomer
                                        //});
                                        //model.save({}, {
                                        //    headers: {
                                        //        mid: mid
                                        //    },
                                        //    success: function (model) {
                                        //        $(self).dialog("close");
                                        //        that.opportunitiesCollection.add(model);
                                        //        itemIndex = that.opportunitiesCollection.indexOf(model)+1;
                                        //        Backbone.history.navigate("#home/content-Opportunities/form/" + itemIndex, { trigger: true });
                                        //    }

                                        //});
                                    },
                                    Cancel: function () {
                                        $(this).dialog("close");
                                    }
                                },

                                close: function () {
                                    $(this).dialog("close");
                                }
                            }, this);
                        }

                        break;
                }
                return this;
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
                                model.destroy(
                                   {
                                       headers: {
                                           mid: mid
                                       }
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
                                success: function () {
                                    Backbone.history.navigate("#home/content-Leads", { trigger: true });
                                }
                            });
                            break;
                        }
                }
            }
        });

        return ContentView;
    });
