define([
    "text!templates/Projects/CreateTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/ProjectModel",
    "custom"
],
    function (CreateTemplate, AccountsDdCollection, CustomersCollection, WorkflowsCollection, ProjectModel, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.accountDdCollection = new AccountsDdCollection();
                this.accountDdCollection.bind('reset', _.bind(this.render, this));
                this.customersDdCollection = new CustomersCollection();
                this.customersDdCollection.bind('reset', _.bind(this.render, this));
                this.workflowsDdCollection = new WorkflowsCollection({ id: 'project' });
                this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.projectsCollection = options.collection;
                this.projectsCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            close: function () {
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var projectModel = new ProjectModel();

                var projectname = $("#projectName").val();

                var idCustomer = $(this.el).find("#customerDd option:selected").val();
                var customer = this.customersDdCollection.get(idCustomer).toJSON();

                var idManager = $("#managerDd option:selected").val();
                var projectmanager = this.accountDdCollection.get(idManager).toJSON();

                var idWorkflow = $("#workflowDd option:selected").val();
                var workflow = this.workflowsDdCollection.get(idWorkflow).toJSON();

                var $userNodes = $("#usereditDd option:selected"), users = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        uid: val.value,
                        uname: val.innerHTML
                    });
                });


                projectModel.save({
                    projectname: $("#projectName").val(),
                    customer: {
                        id: customer._id,
                        type: customer.type,
                        name: customer.name.last + ' ' + customer.name.first
                    },
                    projectmanager: {
                        uid: projectmanager._id,
                        uname: projectmanager.name.last + ' ' + projectmanager.name.first
                    },
                    workflow: {
                        name: workflow.name,
                        status: workflow.status
                    },
                    teams: {
                        users: users
                    }
                },
                {
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

                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });

            },

            render: function () {
                this.$el.html(this.template({ accountDdCollection: this.accountDdCollection, customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection }));
                return this;
            }

        });

        return CreateView;
    });