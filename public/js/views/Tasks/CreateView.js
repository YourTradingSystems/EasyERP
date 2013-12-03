define([
    "text!templates/Tasks/CreateTemplate.html",
    "models/TasksModel",
    "common",
    "custom"
],
    function (CreateTemplate, TaskModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Tasks",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new TaskModel();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #deadline": "showDatePicker",
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

            showDatePicker: function (e) {
                if ($(".createFormDatepicker").find(".arrow").length == 0) {
                    $(".createFormDatepicker").append("<div class='arrow'></div>");
                }

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
            hideDialog: function () {
                $(".edit-dialog").remove();
            },
            saveItem: function () {
                var self = this;
                var mid = 39;
                var summary = $("#summary").val();
                var project = $("#projectDd option:selected").val();
                var assignedTo = $("#assignedToDd option:selected").val();
                var deadline = $.trim($("#deadline").val());
                var tags = $.trim($("#tags").val()).split(',');
                var description = $("#description").val();
                var sequence = $.trim($("#sequence").val());
                var StartDate = $.trim($("#StartDate").val());
                var EndDate = $.trim($("#EndDate").val());
                var workflow = $("#workflowsDd option:selected").data("id");
                var estimated = $("#estimated").val();
                var logged = $("#logged").val();
                var idPriority = $("#priorityDd option:selected").val();
                //var priority = common.toObject(idPriority, this.priorityCollection);

                var type = this.$("#type option:selected").text();

                this.model.save({
                    type: type,
                    summary: summary,
                    assignedTo: assignedTo ? assignedTo : "",
                    workflow: workflow,
                    project: project ? project : "",
                    tags: tags,
                    deadline: deadline,
                    description: description,
                    extrainfo: {
                        //priority: priority,
                        sequence: sequence,
                        StartDate: StartDate,
                        EndDate: EndDate
                    },
                    estimated: estimated,
                    logged: logged
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        model = model.toJSON();
                        self.hideDialog();
                        if (!model.project._id) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });

                        } else {
                            Backbone.history.navigate("home/content-Tasks/kanban/" + model.project._id, { trigger: true });
                        }
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                var projectID = (window.location.hash).split('/')[2];
                model = projectID
                    ? {
                         project: {
                              _id: projectID
                         }
                    }
                    : null;
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: "Create Task",
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
                common.populateProjectsDd(App.ID.projectDd, "/getProjectsForDd", model);
                common.populateWorkflows("Task", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows");
                common.populateEmployeesDd(App.ID.assignedToDd, "/getPersonsForDd");
                common.populatePriority(App.ID.priorityDd, "/Priority");

                $('#deadline').datepicker({ dateFormat: "d M, yy", showOtherMonths: true, selectOtherMonths: true });
                $("#ui-datepicker-div").addClass("createFormDatepicker");

                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
