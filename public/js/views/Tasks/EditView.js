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
                this.currentModel = this.tasksCollection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "change #workflowDd": "changeWorkflowValues"
            },

            hideDialog: function () {
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
                } else {
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
                debugger;

                var project = this.$el.find("#projectDd option:selected").val();
                var assignedTo = this.$el.find("#assignedToDd option:selected").val();

                var tags = $.trim(this.$el.find("#tags").val()).split(',');
                if (tags.length == 0) {
                    tags = null;
                }

                var sequence = parseInt($.trim($("#sequence").val()));
                if (!sequence) {
                    sequence = null;
                }

                var customer = this.$el.find("#customerDd option:selected").val();
                var workflow = this.$el.find("#workflowValue option:selected").val();


                var estimated = $("#estimated").val();
                if ($.trim(estimated) == "") {
                    estimated = 0;
                }

                var logged = $("#logged").val();
                if ($.trim(logged) == "") {
                    logged = 0;
                }

                var priority = this.$el.find("#priority option:selected").val();

                var data = {
                    type: this.$el.find("#type option:selected").text(),
                    summary: this.$el.find("#summary").val(),
                    assignedTo: assignedTo,
                    workflow: workflow,
                    project: project,
                    tags: tags,
                    deadline: $.trim(this.$el.find("#deadline").val()),
                    description: this.$el.find("#description").val(),
                    extrainfo: {
                       // priority: priority,
                        sequence: sequence,
                       // customer: customer,
                        StartDate: $.trim(this.$el.find("#StartDate").val()),
                        EndDate: $.trim(this.$el.find("#EndDate").val())
                    },
                    estimated: estimated,
                    logged: logged
                };


                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        $(".edit-task-dialog").remove();
                        if (project == '0' || !project) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        } else {
                            Backbone.history.navigate("home/content-Tasks/kanban/" + project, { trigger: true });
                        }
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },

            changeWorkflowValues: function () {
                this.$("#workflowValue").html("");
                var that = this;
                var choosedWorkflow = _.filter(that.workflows, function (workflow) {
                    return workflow.wId == that.$("#workflowDd option:selected").val();
                });
                console.log(this.currentModel.get('workflow')._id);
                _.each(choosedWorkflow, function (value,key) {
                     this.currentModel.get('workflow')._id === value._id ?
                     this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ).attr('selected', 'selected')):
                     this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ));
                },this);
            },

            populateDropDown: function (type, selectId, url, val) {
                var selectList = $(selectId);
                var self = this;
                var workflowNames = [];
                this.workflows = [];
                var my_wId;
                dataService.getData(url, { mid: 39 }, function (response) {
                    var options = $.map(response.data, function (item) {
                        switch (type) {
                            case "project":
                                return self.projectOption(item);
                            case "person":
                                return self.personOption(item);
                            case "priority":
                                return self.priorityOption(item);
                            case "workflow": {
                                 self.workflows.push(item);
                                 if ((_.indexOf(workflowNames, item.wName)=== -1) ) {
                                     $(App.ID.workflowDd).append(self.workflowValueOption(item));
                                 }
                                 workflowNames.push(item.wName);
                            }
                        }
                    });
                       selectList.append(options);

                    if(typeof val!="undefined")
                            selectList.val(val).trigger("change");
                });
            },
            workflowValueOption: function (item) {
                return this.currentModel.get("workflow").wId === item.wId ?
                    $('<option/>').val(item.wId).text(item.wName).attr('selected', 'selected') :
                    $('<option/>').val(item.wId).text(item.wName);
            },

            workflowOption: function (item) {
                return this.currentModel.get("workflow")._id === item._id ?
                      $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                      $('<option/>').val(item._id).text(item.name);
            },
            projectOption: function (item) {
                return this.currentModel.get("project")._id === item._id ?
                    $('<option/>').val(item._id).text(item.projectName).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.projectName);
            },
            personOption: function (item) {
                return this.currentModel.get("assignedTo")._id === item._id ?
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
            },
            priorityOption: function (item) {
                return this.currentModel.id === item._id ?
                    $('<option/>').val(item._id).text(item.priority).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.priority);
            },

            render: function () {
                console.log(this.currentModel);
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });

                this.$el = $(formString).dialog({
                    dialogClass: "edit-task-dialog",
                    width: "50%",
                    height: 513,
                    title: this.currentModel.toJSON().project.projectShortDesc
                });
                var that = this;
                this.populateDropDown("project", App.ID.projectDd, "/getProjectsForDd");
                this.populateDropDown("person", App.ID.assignedToDd, "/getPersonsForDd");
                this.populateDropDown("priority", App.ID.priorityDd, "/Priority");
                this.populateDropDown("workflow", App.ID.workflowDd, "/taskWorkflows", that.currentModel.toJSON().workflow._id);



                $('#StartDate').datepicker({ dateFormat: "d M, yy" });
                $('#EndDate').datepicker({ dateFormat: "d M, yy" });
                $('#deadline').datepicker({ dateFormat: "d M, yy" });
                this.delegateEvents(this.events);

                return this;
            }

        });
        return EditView;
    });
