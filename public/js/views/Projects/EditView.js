define([
    "text!templates/Projects/EditTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "custom",
    "common"
],
    function (EditTemplate, AccountsDdCollection, ProjectsCollection, CustomersCollection, WorkflowsCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",

            initialize: function (options) {
                this.accountsDdCollection = new AccountsDdCollection();
                this.customersDdCollection = new CustomersCollection();
                this.workflowsDdCollection = new WorkflowsCollection({ id: 'project' });
                this.projectsCollection = options.collection;

                this.projectsCollection.bind('reset', _.bind(this.render, this));
                this.accountsDdCollection.bind('reset', _.bind(this.render, this));
                this.customersDdCollection.bind('reset', _.bind(this.render, this));
                this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
            },

            events: {
                "click .breadcrumb a": "changeWorkflow"
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

            saveItem: function () {
                var self = this;
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {

                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var projectName = $("#projectName").val();
                    var projectShortDesc = $("#projectShortDesc").val();
                    var idCustomer = $(this.el).find("#customerDd option:selected").val();
                    var _customer = common.toObject(idCustomer, this.customersDdCollection);
                    var customer = {};
                    if (_customer) {
                        customer.id = _customer._id;
                        customer.name = _customer.name;
                    } else {
                        customer = currentModel.defaults.customer;
                    }
                    var idManager = $("#managerDd option:selected").val();
                    var _projectmanager = common.toObject(idManager, this.accountsDdCollection);
                    var projectmanager = {};
                    if (_projectmanager) {
                        projectmanager.id = _projectmanager._id;
                        projectmanager.imageSrc = _projectmanager.imageSrc;
                        projectmanager.name = _projectmanager.name.first + ' ' + _projectmanager.name.last;
                    } else {
                        projectmanager = currentModel.defaults.projectmanager;
                    }

                    var idWorkflow = $("#workflowDd option:selected").val();
                    var workflow = common.toObject(idWorkflow, this.workflowsDdCollection);
                    if (!workflow) {
                        workflow = currentModel.defaults.workflow;
                    }

                    var $userNodes = $("#usereditDd option:selected"), users = [];
                    $userNodes.each(function (key, val) {
                        users.push({
                            id: val.value,
                            name: val.innerHTML
                        });
                    });


                    currentModel.set({
                        projectName: projectName,
                        projectShortDesc: projectShortDesc,
                        customer: customer,
                        projectmanager: projectmanager,
                        workflow: workflow,
                        teams: {
                            users: users
                        }
                    });

                    currentModel.save({}, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
                }

            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.projectsCollection.models[itemIndex];
                    currentModel.on('change', this.render, this);
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), accountsDdCollection: this.accountsDdCollection, customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection }));
                    var workflows = this.workflowsDdCollection.models;

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
                common.contentHolderHeightFixer();
                return this;
            }

        });

        return EditView;
    });