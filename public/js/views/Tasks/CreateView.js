define([
    "text!templates/Tasks/CreateTemplate.html",
    "collections/Projects/ProjectsDdCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Tasks/TasksCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "collections/Priority/TaskPriority",
    "models/TaskModel",
    "custom"
],
    function (CreateTemplate, ProjectsDdCollection, AccountsDdCollection, TasksCollection, CustomersCollection, WorkflowsCollection, PriorityCollection, TaskModel, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Tasks",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.projectsDdCollection = new ProjectsDdCollection();
                this.projectsDdCollection.bind('reset', _.bind(this.render, this));
                this.accountDdCollection = new AccountsDdCollection();
                this.accountDdCollection.bind('reset', _.bind(this.render, this));
                this.customersDdCollection = new CustomersCollection();
                this.customersDdCollection.bind('reset', _.bind(this.render, this));
                this.workflowsDdCollection = new WorkflowsCollection({ id: "task" });
                this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.tasksCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            events: {
                "click #tabList a": "switchTab"
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

            saveItem: function () {
                var self = this;
                var mid = 39;

                var taskModel = new TaskModel();

                var summary = $("#summary").val();

                var idProject = this.$("#projectDd option:selected").val();
                var projectObj = this.projectsDdCollection.get(idProject);
                var project = {};
                if (projectObj) {
                    project.projectName = projectObj.get("name");
                    project.pId = idProject;
                }

                var assignedto = {};
                var idAssignedTo = this.$("#assignedTo option:selected").val();
                var unameAssignedTo = this.accountDdCollection.get(idAssignedTo);
                if (unameAssignedTo) {
                    assignedto.uname = unameAssignedTo.get('name').first + " " + unameAssignedTo.get('name').last;
                    assignedto.uid = idAssignedTo;
                }

                var deadlineSt = $.trim($("#deadline").val());
                var deadline = "";
                if (deadlineSt) {
                    deadline = new Date(Date.parse(deadlineSt)).toISOString();
                }

                var tags = $.trim($("#tags").val()).split(',');

                var description = $("#description").val();

                var sequence = parseInt($.trim($("#sequence").val()));

                var startDateSt = $.trim($("#StartDate").val());
                var StartDate = "";
                if (startDateSt) {
                    StartDate = new Date(Date.parse(startDateSt)).toISOString();
                }

                var endDateSt = $.trim($("#EndDate").val());
                var EndDate = "";
                if (endDateSt) {
                    EndDate = new Date(Date.parse(endDateSt)).toISOString();
                }

                var idCustomer = this.$("#customerDd option:selected").val();
                var customerObj = this.customersDdCollection.get(idCustomer);
                var customer = {};
                if (customerObj) {
                    customer.name = customerObj.get("name").first + " " + customerObj.get("name").last;
                    customer.id = idCustomer;
                    customer.type = customerObj.get("type");
                }

                var idWorkflow = this.$("#workflowDd option:selected").val();
                var workflow = this.workflowsDdCollection.get(idWorkflow);
                if (workflow) {
                    workflow = workflow.toJSON();
                }

                var estimated = $("#estimated").val();

                var loged = $("#loged").val();

                var priority = $("#priority").val();

                taskModel.save({
                    summary: summary,
                    assignedto: assignedto,
                    workflow: workflow,
                    project: project,
                    tags: tags,
                    deadline: deadline,
                    description: description,
                    extrainfo: {
                        priority: priority,
                        sequence: sequence,
                        customer: customer,
                        StartDate: StartDate,
                        EndDate: EndDate
                    },
                    estimated: estimated,
                    loged: loged
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                this.$el.html(this.template({
                    projectsDdCollection: this.projectsDdCollection, accountDdCollection: this.accountDdCollection, customersDdCollection: this.customersDdCollection,
                    workflowsDdCollection: this.workflowsDdCollection, priorityCollection: this.priorityCollection
                }));

                return this;
            }

        });

        return CreateView;
    });