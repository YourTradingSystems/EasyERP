define([
    "text!templates/Projects/CreateTemplate.html",
    "text!templates/Projects/selectTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/ProjectsModel",
    "common"
],
    function (CreateTemplate, selectTemplate, AccountsDdCollection, CustomersCollection, WorkflowsCollection, ProjectModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.accountDdCollection = new AccountsDdCollection();
                this.accountDdCollection.bind('reset', _.bind(this.render, this));
                this.customersDdCollection = new CustomersCollection();
                this.customersDdCollection.bind('reset', _.bind(this.render, this));
                this.workflowsDdCollection = new WorkflowsCollection({ id: 'Project' });
                this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.projectsCollection = options.collection;
                this.projectsCollection.bind('reset', _.bind(this.render, this));
                this.render = _.after(3, this.render);
            },

            events: {
                "submit form": "formSubmitHandler",
                "change #workflowNames": "changeWorkflows"
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status, _id: value[i]._id });
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsDdCollection.findWhere({ name: name }).toJSON().value;
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
            },

            formSubmitHandler: function (event) {
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

                var customer = $(this.el).find("#customerDd option:selected").val();
                //var customer = common.toObject(idCustomer, this.customersDdCollection);

                var projectmanager = $("#managerDd option:selected").val();
                //var projectmanager = common.toObject(idManager, this.accountDdCollection);

                //var idWorkflow = $("#workflowDd option:selected").val();
                //var workflow = common.toObject(idWorkflow, this.workflowsDdCollection);

                //var workflow = {
                //    wName: this.$("#workflowNames option:selected").text(),
                //    name: this.$("#workflow option:selected").text(),
                //    status: this.$("#workflow option:selected").val(),
                //};
                var workflow = this.$("#workflow option:selected").data("id");

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
                var workflowNames = [];
                this.workflowsDdCollection.models.forEach(function (option) {
                    workflowNames.push(option.get('name'));
                });
                this.$el.html(this.template({
                    accountDdCollection: this.accountDdCollection,
                    customersDdCollection: this.customersDdCollection,
                    workflowsDdCollection: this.workflowsDdCollection,
                    workflowNames: workflowNames
                }));
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(this.workflowsDdCollection.models[0].get('value')) }));
                return this;
            }

        });

        return CreateView;
    });