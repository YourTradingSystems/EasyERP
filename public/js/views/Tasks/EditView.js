define([
    "text!templates/Tasks/EditTemplate.html",
    "collections/Projects/ProjectsDdCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Tasks/TasksCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "collections/Priority/TaskPriority",
    "common",
    "custom"
],
    function (EditTemplate, ProjectsDdCollection, AccountsDdCollection, TasksCollection, CustomersCollection, WorkflowsCollection, PriorityCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: ".form-holder",
            contentType: "Tasks",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render");
                this.renderView = _.after(5, this.render);
                this.projectsDdCollection = new ProjectsDdCollection();
                this.accountsDdCollection = new AccountsDdCollection();
                this.customersDdCollection = new CustomersCollection();
                this.workflowsDdCollection = new WorkflowsCollection({ id: "task" });
                this.priorityCollection = new PriorityCollection();
                this.tasksCollection = options.collection;
                this.currentModel = this.tasksCollection.models[Custom.getCurrentII()-1];
                this.projectsDdCollection.bind('reset', _.bind(this.renderView, this));
                this.tasksCollection.bind('reset', _.bind(this.renderView, this));
                this.accountsDdCollection.bind('reset', _.bind(this.renderView, this));
                this.customersDdCollection.bind('reset', _.bind(this.renderView, this));
                this.workflowsDdCollection.bind('reset', _.bind(this.renderView, this));
                this.priorityCollection.bind('reset', _.bind(this.renderView, this));
            },
            renderView:function(){
                console.log('RENDERVIEW');
            },
            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
                "click #saveBtn" : "saveItem",
                "click #cancelBtn" : "hideDialog"
            },

            hideDialog: function(){
                this.$el.dialog('close');
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

            saveItem: function (event) {
                event.preventDefault();
                var self = this;

                var mid = 39;

                var summary = $("#summary").val().trim();

                var idProject = this.$el.find("#projectDd option:selected").val();
                var _project = common.toObject(idProject, this.projectsDdCollection);
                var project = {};
                if (_project) {
                    project.id = _project._id;
                    project.name = _project.projectName;
                    project.projectShortDesc = _project.projectShortDesc;
                } else {
                    project = this.currentModel.defaults.project;
                }

                var assignedTo = {};
                var idAssignedTo = this.$el.find("#assignedTo option:selected").val();
                var _assignedTo = common.toObject(idAssignedTo, this.accountsDdCollection);
                if (_assignedTo) {
                    assignedTo.name = _assignedTo.name.first + " " + _assignedTo.name.last;
                    assignedTo.id = _assignedTo._id;
                    assignedTo.imageSrc = _assignedTo.imageSrc;
                } else {
                    assignedTo = this.currentModel.defaults.assignedTo;
                }

                var deadline = $.trim($("#deadline").val());
                var tags = $.trim($("#tags").val()).split(',');
                if (tags.length == 0) {
                    tags = null;
                }

                var description = $("#description").val().trim();

                var sequence = parseInt($.trim($("#sequence").val()));
                if (!sequence) {
                    sequence = null;
                }
                var StartDate = $.trim($("#StartDate").val());

                var EndDate = $.trim($("#EndDate").val());

                var idCustomer = this.$el.find("#customerDd option:selected").val();
                var _customer = common.toObject(idCustomer, this.customersDdCollection);
                var customer = {};
                if (_customer) {
                    customer.id = _customer._id;
                    customer.name = _customer.name;
                } else {
                    customer = this.currentModel.defaults.extrainfo.customer;
                }

                var idWorkflow = this.$el.find("#workflowDd option:selected").val();
                var workflow = this.workflowsDdCollection.get(idWorkflow);
                if (!workflow) {
                    workflow = this.currentModel.defaults.workflow;
                }

                var estimated = $("#estimated").val();
                if ($.trim(estimated) == "") {
                    estimated = 0;
                }
                var logged = $("#logged").val();
                if ($.trim(logged) == "") {
                    logged = 0;
                }

                var idPriority = this.$el.find("#priority option:selected").val();
                var _priority = common.toObject(idPriority, this.priorityCollection);
                var priority;
                if (_priority) {
                    priority = _priority.priority
                } else {
                    priority = this.currentModel.defaults.extrainfo.priority;
                }


                this.currentModel.save({
                    summary: summary,
                    assignedTo: assignedTo,
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
                    logged: logged
                }, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        if (project.id == '0' || !project.id) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });

                        } else {
                            self.$el.dialog('close');
                            Backbone.history.navigate("home/content-Tasks/kanban/" + project.id, { trigger: true });
                        }
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },

            render: function () {
                //var itemIndex = Custom.getCurrentII() - 1;
                var formString = this.template({
                    model: this.currentModel.toJSON(),
                    projectsDdCollection: this.projectsDdCollection.toJSON(),
                    accountsDdCollection: this.accountsDdCollection.toJSON(),
                    customersDdCollection: this.customersDdCollection.toJSON(),
                    priorityCollection: this.priorityCollection.toJSON(),
                    workflowsDdCollection: this.workflowsDdCollection.toJSON()});

                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:true,
                    title: "Edit Task"
                });
                this.delegateEvents(this.events);
                //this.el = $('.form-holder');
                //this.delegateEvents(this.events);

                /*if (itemIndex == -1) {
                    this.$el.html();
                }
                else {*/
                    //var currentModel = this.tasksCollection.models[itemIndex];
                    //currentModel.on('change', this.render, this);
                    //var extrainfo = currentModel.get('extrainfo');
                    //extrainfo['StartDate'] = (currentModel.get('extrainfo').StartDate) ? common.ISODateToDate(currentModel.get('extrainfo').StartDate) : '';
                    //extrainfo['EndDate'] = (currentModel.get('extrainfo').EndDate) ? common.ISODateToDate(currentModel.get('extrainfo').EndDate) : '';
                    //deadline = (currentModel.get('deadline')) ? common.ISODateToDate(currentModel.get('deadline')) : '';
                    //currentModel.set({ deadline: deadline, extrainfo: extrainfo }, { silent: true });
                   /* this.$el.html(_.template(EditTemplate, {
                        model: this.currentModel.toJSON(), projectsDdCollection: this.projectsDdCollection, accountsDdCollection: this.accountsDdCollection,
                        customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection, priorityCollection: this.priorityCollection
                    }));*/
                   
                 /*   var workflows = this.workflowsDdCollection.models;
                    var that = this;
                    _.each(workflows, function (workflow, index) {
                        if (index < workflows.length - 2) {
                            $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                        }
                    });

                    _.each(workflows, function (workflow, i) {
                        var breadcrumb = this.$(".breadcrumb li").eq(i);
                        if (this.currentModel.get("workflow").name === breadcrumb.data("name")) {
                            breadcrumb.find("a").addClass("active");
                        }
                    }, this);
                //}
                $('#deadline').datepicker({ dateFormat: "d M, yy", showOtherMonths: true, selectOtherMonths: true });
                $('#StartDate').datepicker({ dateFormat: "d M, yy" });
                $('#EndDate').datepicker({ dateFormat: "d M, yy" });*/
                return this;
            }

        });
        return EditView;
    });