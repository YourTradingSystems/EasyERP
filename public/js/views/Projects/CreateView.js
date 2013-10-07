define([
    "text!templates/Projects/CreateTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/ProjectModel",
    "common"
],
    function (CreateTemplate, AccountsDdCollection, CustomersCollection, WorkflowsCollection, ProjectModel, common) {

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
                if ($.trim(projectname) == "") {
                    projectname = "New Project";
                }

                var idCustomer = $(this.el).find("#customerDd option:selected").val();

                var customer = common.toObject(idCustomer, this.customersDdCollection);

                var idManager = $("#managerDd option:selected").val();
                var projectmanager = common.toObject(idManager, this.accountDdCollection);

                var idWorkflow = $("#workflowDd option:selected").val();
                var workflow = common.toObject(idWorkflow, this.workflowsDdCollection);

                var $userNodes = $("#usereditDd option:selected"), users = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        uid: val.value,
                        uname: val.innerHTML
                    });
                });


                projectModel.save({
                    projectname: projectname,
                    customer: customer,
                    projectmanager: projectmanager,
                    workflow: workflow,
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
            },

            render: function () {
                this.$el.html(this.template({ accountDdCollection: this.accountDdCollection, customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection }));
                return this;
            }

        });

        return CreateView;
    });