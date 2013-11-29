define([
    "text!templates/Applications/CreateTemplate.html",
    "models/ApplicationModel",
    "common"
],
    function (CreateTemplate, ApplicationModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new ApplicationModel();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows"
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
            },
            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                //$("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
            },

            isEmployee: function (e) {
                $(e.target).addClass("pressed");
                this.saveItem();
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

                var isEmployee = false;
                if (this.$("#hire>span").hasClass("pressed")) {
                    isEmployee = true;
                    self.contentType = "Employees";
                }
                var subject = $.trim($("#subject").val());
                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var name = {
                    first: first,
                    last: last
                };
                var wemail = $.trim($("#wemail").val());
                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var wphones = {
                    phone: phone,
                    mobile: mobile
                };

                var workflow = $("#workflowsDd option:selected").data("id");
                var relatedUserId = $("#relatedUsersDd option:selected").val();
                var nextActionSt = $.trim($("#nextAction").val());
                var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }
                var sourceId = $("#source option:selected").val();
                var referredBy = $.trim($("#referredBy").val());
                var departmentId = $("#departmentDd option:selected").val();

                var jobPositionId = $("#jobPositionDd option:selected").val();

                var expectedSalary = $.trim($("#expectedSalary").val());
                var proposedSalary = $.trim($("#proposedSalary").val());
                var tags = $.trim($("#tags").val()).split(',');
                var otherInfo = $("#otherInfo").val();

                this.model.save({
                    isEmployee: isEmployee,
                    subject: subject,
                    imageSrc: this.imageSrc,
                    name: name,
                    workEmail: wemail,
                    wphones: wphones,
                    relatedUser: relatedUserId,
                    nextAction: nextAction,
                    source: sourceId,
                    referredBy: referredBy,
                    department: departmentId,
                    jobPosition: jobPositionId,
                    expectedSalary: expectedSalary,
                    proposedSalary: proposedSalary,
                    tags: tags,
                    otherInfo: otherInfo,
                    workflow: workflow
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: "Create Application",
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
                common.populateWorkflows("Application", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows");
                common.populateEmployeesDd(App.ID.relatedUsersDd, "/getPersonsForDd");
                common.populateSourceApplicants(App.ID.sourceDd, "/SourcesOfApplicants");
                common.populateDepartments(App.ID.departmentDd, "/Departments");
                common.populateDegrees(App.ID.degreesDd, "/Degrees");
                common.populateJobPositions(App.ID.jobPositionDd, "/JobPosition");
                common.canvasDraw({ model: this.model.toJSON() }, this);
                $('#nextAction').datepicker();
                return this;
            }

        });

        return CreateView;
    });
