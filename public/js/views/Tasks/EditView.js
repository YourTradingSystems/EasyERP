define([
    "text!templates/Tasks/EditTemplate.html",
    "collections/Projects/ProjectsDdCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Tasks/TasksCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "collections/Priority/TaskPriority",
    "custom"
],
    function (EditTemplate, ProjectsDdCollection, AccountsDdCollection, TasksCollection, CustomersCollection, WorkflowsCollection, PriorityCollection, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Tasks",

            initialize: function (options) {
                this.projectsDdCollection = new ProjectsDdCollection();
                this.accountsDdCollection = new AccountsDdCollection();
                this.customersDdCollection = new CustomersCollection();
                this.workflowsDdCollection = new WorkflowsCollection({ id: "task" });
                this.priorityCollection = new PriorityCollection();
                this.tasksCollection = options.collection;

                this.projectsDdCollection.bind('reset', _.bind(this.render, this));
                this.tasksCollection.bind('reset', _.bind(this.render, this));
                this.accountsDdCollection.bind('reset', _.bind(this.render, this));
                this.customersDdCollection.bind('reset', _.bind(this.render, this));
                this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                
                this.render();

            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow"
            },

            changeWorkflow: function (e) {
                var mid = 39;
                var model = {};
                var name = '', status = '';
                if ($(e.target).hasClass("applicationWorkflowLabel")) {
                    var breadcrumb = $(e.target).closest('li');
                    var a = breadcrumb.siblings().find("a");
                    if (a.hasClass("active")) {
                        a.removeClass("active");
                    }
                    breadcrumb.find("a").addClass("active");
                    name = breadcrumb.data("name");
                    status = breadcrumb.data("status");
                }
                else {
                    var workflow = {};
                    var length = this.workflowsDdCollection.models.length;
                    if ($(e.target).closest("button").attr("id") == "Cancel") {
                        workflow = this.workflowsDdCollection.models[length - 1];
                    }
                    else {
                        workflow = this.workflowsDdCollection.models[length - 2];
                    }
                    name = workflow.get('name');
                    status = workflow.get('status');
                }
                model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
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
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var summary = $("#summary").val();
                    if ($.trim(summary) == "") {
                        summary = "New Summary";
                    }

                    var idProject = this.$("#projectDd option:selected").val();
                    var project = this.projectsDdCollection.get(idProject);
                    if (!project) {
                        project = null;
                    } else {
                        project = project.toJSON();
                    }

                    var assignedto = {};
                    var idAssignedTo = this.$("#assignedTo option:selected").val();
                    var unameAssignedTo = this.accountsDdCollection.get(idAssignedTo);
                    if (!unameAssignedTo) {
                        assignedto = null;
                    }
                    else {
                        assignedto.uname = unameAssignedTo.get('name').first + " " + unameAssignedTo.get('name').last;
                        assignedto.uid = idAssignedTo;
                    }


                    var deadlineSt = $.trim($("#deadline").val());
                    var deadline = "";
                    if (!deadlineSt) {
                        deadline = null;
                    }
                    else {
                        deadline = new Date(Date.parse(deadlineSt)).toISOString();
                    }

                    var tags = $.trim($("#tags").val()).split(',');
                    if (tags.length == 0) {
                        tags = null;
                    }

                    var description = $("#description").val();
                    if ($.trim(description) == "") {
                        description = "New Description";
                    }

                    var sequence = parseInt($.trim($("#sequence").val()));
                    if (!sequence) {
                        sequence = null;
                    }

                    var startDateSt = $.trim($("#StartDate").val());
                    var StartDate = "";
                    if (!startDateSt) {
                        StartDate = null;
                    }
                    else {
                        StartDate = new Date(Date.parse(startDateSt)).toISOString();
                    }

                    var endDateSt = $.trim($("#EndDate").val());
                    var EndDate = "";
                    if (!endDateSt) {
                        EndDate = null;
                    }
                    else {
                        EndDate = new Date(Date.parse(endDateSt)).toISOString();
                    }

                    var idCustomer = this.$("#customerDd option:selected").val();
                    var customer = this.customersDdCollection.get(idCustomer);
                    console.log(idCustomer);
                    if (!customer) {
                        customer = null;
                    } else {
                        customer = customer.toJSON();
                    }

                    var idWorkflow = this.$("#workflowDd option:selected").val();
                    var workflow = this.workflowsDdCollection.get(idWorkflow);
                    if (!workflow) {
                        workflow = null;
                    } else {
                        workflow = workflow.toJSON();
                    }

                    var estimated = $("#estimated").val();
                    if ($.trim(estimated) == "") {
                        estimated = 0;
                    }
                    var loged = $("#loged").val();
                    if ($.trim(loged) == "") {
                        loged = 0;
                    }
                    
                    var priority = $("#priority").val();
                    if ($.trim(priority) == "") {
                        priority = null;
                    }

                    currentModel.set({
                        summary: summary,
                        assignedto: assignedto,
                        workflow: workflow,
                        project: {
                            pId: idProject,
                            projectName: project.projectname
                        },
                        tags: tags,
                        deadline: deadline,
                        description: description,
                        extrainfo: {
                            priority: priority,
                            sequence: sequence,
                            customer:
                                {
                                    id: idCustomer,
                                    name: customer.name,
                                    type: customer.type
                                },
                            StartDate: StartDate,
                            EndDate: EndDate
                        },
                        estimated: estimated,
                        loged: loged
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

            ISODateToDate: function (ISODate) {
                var date = ISODate.split('T')[0].replace(/-/g, '/');
                return date;
            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                }
                else {
                    var currentModel = this.tasksCollection.models[itemIndex];
                    currentModel.on('change', this.render, this);
                    //var extrainfo = currentModel.get('extrainfo');
                    //extrainfo['StartDate'] = this.ISODateToDate(currentModel.get('extrainfo').StartDate);
                    //extrainfo['EndDate'] = this.ISODateToDate(currentModel.get('extrainfo').EndDate);
                    //currentModel.set({ deadline: this.ISODateToDate(currentModel.get('deadline')), extrainfo: extrainfo }, { silent: true });
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(), projectsDdCollection: this.projectsDdCollection, accountsDdCollection: this.accountsDdCollection,
                        customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection, priorityCollection: this.priorityCollection
                    }));
                   
                    var workflows = this.workflowsDdCollection.models;
                    var that = this;
                    _.each(workflows, function (workflow, index) {
                        if (index < workflows.length - 2) {
                            $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                        }
                    });

                    _.each(workflows, function (workflow, i) {
                        var breadcrumb = this.$(".breadcrumb li").eq(i);
                        if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                            breadcrumb.find("a").addClass("active");
                        }
                    }, this);
                }
                return this;
            }

        });
        return EditView;
    });