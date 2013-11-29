define([
    'text!templates/Leads/list/ListTemplate.html',
    'text!templates/Leads/form/FormTemplate.html',
    'collections/Leads/LeadsCollection',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Workflows/WorkflowsCollection',
    'custom',
    'views/Leads/EditView',
    'views/Leads/CreateView'
],
    function (ListTemplate, FormTemplate, LeadsCollection, OpportunitiesCollection, WorkflowsCollection, Custom, EditView, CreateView) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                console.log('Init Leads View');
                this.workflowsCollection = new WorkflowsCollection({ id: 'Lead' });
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
			createItem: function () {
				new CreateView({ collection: this.collection });
				
			},

            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#home/content-Leads/form/" + id;
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
                        workflow = this.workflowsCollection.toJSON()[0].value.models[this.workflowsCollection.toJSON()[0].value.models.length - 1];
                    }
                    else {
                        workflow = this.workflowsCollection.toJSON()[0].value.models[0];
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
                            this.$el.html(_.template(ListTemplate, { leadsCollection: this.collection.toJSON() }));

                            $('#check_all').click(function () {
                                var c = this.checked;
                                $(':checkbox').prop('checked', c);
                            });
                            break;
                        }
                    case "form":
                        {
                            var currentModel = this.collection.getElement();
                            if (!currentModel) {
                                this.$el.html('<h2>No Application found</h2>');
                            } else {
                                this.$el.html(_.template(FormTemplate, currentModel.toJSON() ));
//                                currentModel.off('change');
//                                currentModel.on('change', this.render, this);
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
                                                        Backbone.history.navigate("#home/content-Opportunities/form/" + model.id, { trigger: true });
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
                                        $(this).dialog('close');
                                    }
                                },

                                close: function () {
                                    $(this).dialog('close');
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
            editItem: function(){
                //create editView in dialog here
                new EditView({collection:this.collection});
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
