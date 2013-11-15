define([
    "text!templates/Projects/CreateTemplate.html",
    "models/ProjectsModel",
    "common"
],
    function (CreateTemplate, ProjectModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                this.model = new ProjectModel();
                this.render();
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

                var customer = $("#customerDd option:selected").val();
                var projectmanager = $("#projectManagerDD option:selected").val();
                var workflow = $("#workflowsDd option:selected").data("id");
                var $userNodes = $("#usereditDd option:selected"), users = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
                        name: val.innerHTML
                    });
                });

                this.model.save({
                    projectName: $("#projectName").val(),
                    projectShortDesc: $("#projectShortDesc").val(),
                    customer: customer ? customer : "",
                    projectmanager: projectmanager ? projectmanager : "",
                    workflow: workflow ? workflow : "",
                    teams: {
                        users: users
                    }
                },
                {
                    headers: {
                        mid: mid
                    },
                    //wait: true,
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                    },
                    error: function (model, statusText, xhr) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "50%",
                    title: "Create Project",
                    buttons:{
                        save:{
                            text:"Save",
                            class:"btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });
                common.populateEmployeesDd(App.ID.managerSelect, "/getPersonsForDd");
                common.populateCustomers(App.ID.customerDd, "/Customer");
                common.populateEmployeesDd(App.ID.userEditDd, "/getPersonsForDd");
                common.populateWorkflows("Project", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows");
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
