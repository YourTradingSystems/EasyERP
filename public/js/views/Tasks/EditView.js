define([
    "text!templates/Tasks/EditTemplate.html",
    "common",
    "custom",
    "dataService",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection",
    "collections/Priority/TaskPriority",
    "collections/Workflows/WorkflowsCollection"
],
    function (EditTemplate, common, Custom, dataService, ProjectsCollection, AccountsDdCollection, CustomersDdCollection, PriorityCollection, WorkflowsCollection) {

        var EditView = Backbone.View.extend({
            contentType: "Tasks",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render");
                this.projectsDdCollection = new ProjectsCollection();
                this.workflowsDdCollection = new WorkflowsCollection();
                this.priorityCollection = new PriorityCollection();
                this.accountsDdCollection = new AccountsDdCollection();
                this.customersDdCollection = new CustomersDdCollection();
                this.tasksCollection = options.collection;
                this.currentModel = this.tasksCollection.models[Custom.getCurrentII() - 1];
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog"
            },

            hideDialog: function(){
                $(".edit-task-dialog").remove();
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
                var summary = $("#summary").val();
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

                var description = $("#description").val();

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

                var type = this.$("#type option:selected").text();

                this.currentModel.save({
                    type: type,
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
                        self.$el.dialog('close');
                        if (project.id == '0' || !project.id) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });

                        } else {

                            Backbone.history.navigate("home/content-Tasks/kanban/" + project.id, { trigger: true });
                        }
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },

            populateDropDown: function(type, selectId, url){
                var selectList = $(selectId);
                var self = this;
                dataService.getData(url, {mid:39}, function(response){
                    var options = $.map(response.data, function(item){
                        switch (type){
                            case "project":
                                return self.projectOption(item);
                            case "person":
                                return self.personOption(item);
                            case "priority":
                                return self.priorityOption(item);
                            case "workflow":
                                return self.workflowOption(item);
                        }
                    });
                    selectList.append(options);
                });
            },
            workflowOption: function(item){
                return this.currentModel.get("workflow").id === item._id ?
                    $('<option/>').val(item._id).text(item.name + "(" + item.status + ")").attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.name + "(" + item.status + ")");
            },
            projectOption: function(item){
                return this.currentModel.get("project").id === item._id ?
                    $('<option/>').val(item._id).text(item.projectName).attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.projectName);
            },
            personOption: function(item){
                return this.currentModel.get("assignedTo").id === item._id ?
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
            },
            priorityOption: function(item){
                return this.currentModel.id === item._id ?
                    $('<option/>').val(item._id).text(item.priority).attr('selected','selected') :
                    $('<option/>').val(item._id).text(item.priority);
            },

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()});

                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:false,
					dialogClass: "edit-task-dialog",
					width:"50%",
					height:513,
                    title: this.currentModel.toJSON().project.projectShortDesc
                });

                this.populateDropDown("project", App.ID.projectDd, "/getProjectsForDd");
                this.populateDropDown("person", App.ID.assignedToDd, "/getPersonsForDd");
                this.populateDropDown("priority", App.ID.priorityDd, "/Priority");
                this.populateDropDown("workflow", App.ID.workflowDd, "/taskWorkflows");

                $('#StartDate').datepicker({ dateFormat: "d M, yy" });
                $('#EndDate').datepicker({ dateFormat: "d M, yy" });
                $('#deadline').datepicker({ dateFormat: "d M, yy" });
                this.delegateEvents(this.events);

                return this;
            }

        });
        return EditView;
    });
