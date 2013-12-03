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
                _.bindAll(this, "render", "saveItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #Cancel span, #Done span": "changeWorkflow",
                "change #workflowDd": "changeWorkflowValues",
                'keydown': 'keydownHandler'
            },
            keydownHandler: function(e){
                switch (e.which){
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
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

                var project = $("#projectDd option:selected").val();
                var assignedTo = $("#assignedToDd option:selected").val();

                var tags = $.trim($("#tags").val()).split(',');
                if (tags.length == 0) {
                    tags = null;
                }

                var sequence = parseInt($.trim($("#sequence").val()));
                if (!sequence) {
                    sequence = null;
                }

                var customer = $("#customerDd option:selected").val();
                var workflow = $("#workflowsDd option:selected").val();


                var estimated = $("#estimated").val();
                if ($.trim(estimated) == "") {
                    estimated = 0;
                }

                var logged = $("#logged").val();
                if ($.trim(logged) == "") {
                    logged = 0;
                }

                var priority = $("#priorityDd option:selected").val();

                var data = {
                    type: $("#type option:selected").text(),
                    summary: $("#summary").val(),
                    assignedTo: assignedTo ? assignedTo : null,
                    workflow: workflow ? workflow : null,
                    project: project ? project : null,
                    tags: tags,
                    deadline: $.trim($("#deadline").val()),
                    description: $("#description").val(),
                    extrainfo: {
                        //priority: priority ? priority,
                        sequence: sequence,
                        StartDate: $.trim($("#StartDate").val()),
                        EndDate: $.trim($("#EndDate").val())
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

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: this.currentModel.toJSON().project.projectShortDesc,
                    buttons:{
                        save:{
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });

                $('#StartDate').datepicker({ dateFormat: "d M, yy" });
                $('#EndDate').datepicker({ dateFormat: "d M, yy" });
                $('#deadline').datepicker({ dateFormat: "d M, yy" });
                common.populateProjectsDd(App.ID.projectDd, "/getProjectsForDd", this.currentModel.toJSON());
                common.populateWorkflows("Task", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.assignedToDd, "/getPersonsForDd", this.currentModel.toJSON());
                common.populatePriority(App.ID.priorityDd, "/Priority", this.currentModel.toJSON());
                this.delegateEvents(this.events);
                $('#deadline').datepicker({ dateFormat: "d M, yy", showOtherMonths: true, selectOtherMonths: true });
                $("#ui-datepicker-div").addClass("createFormDatepicker");
                return this;
            }

        });
        return EditView;
    });
