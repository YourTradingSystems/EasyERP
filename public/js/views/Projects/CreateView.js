define([
    "text!templates/Projects/CreateTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/ProjectsModel",
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

            events: {
                "submit form" : "formSubmitHandler"
            },
            formSubmitHandler : function(event){
                event.preventDefault();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var projectModel = new ProjectModel();

               /* var projectName = $("#projectName").val();
                if ($.trim(projectName) == "") {
                    projectName = "New Project";
                }*/

                var idCustomer = $(this.el).find("#customerDd option:selected").val();
                var customer = common.toObject(idCustomer, this.customersDdCollection);

                var idManager = $("#managerDd option:selected").val();
                var projectmanager = common.toObject(idManager, this.accountDdCollection);

                var idWorkflow = $("#workflowDd option:selected").val();
                var workflow = common.toObject(idWorkflow, this.workflowsDdCollection);

                var $userNodes = $("#usereditDd option:selected"), users = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
                        name: val.innerHTML
                    });
                });

                projectModel.save({
                    projectName: $("#projectName").val(),
                    projectShortDesc: $("#projectShortDesc").val(),
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
                    error: function (model, statusText, xhr) {
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