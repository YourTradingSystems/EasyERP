define([
    "text!templates/Applications/EditTemplate.html",
    "common",
    "custom"
],
    function (EditTemplate, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            imageSrc: '',
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, 'saveItem');

            if (options.collection) {
                this.employeesCollection = options.collection;
                this.currentModel = this.employeesCollection.getElement();
            } else {
                this.currentModel = options.model;
            }
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #refuse": "changeWorkflow",
                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler'
            },

            changeWorkflows: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.applicationsCollection.models[itemIndex].toJSON();
                    var name = this.$("#workflowNames option:selected").val();
                    var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                    $("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(value) }));
                }
            },
            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            isEmployee: function (e) {
                var mid = 39;
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                model.set({ isEmployee: true });
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

            hideDialog: function () {
                $(".applications-edit-dialog").remove();
            },

            saveItem: function () {
                var self = this;

                var mid = 39;
                var subject = $("#subject").val();
                var name = {
                    first: $("#first").val(),
                    last: $("#last").val()
                };
                var wemail = $.trim($("#wemail").val());
                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var wphones = {
                    phone: phone,
                    mobile: mobile
                };

                var degreeId = $("#degreesDd option:selected").val();

                var relatedUserId = $("#relatedUsersDd option:selected").val() ? $("#relatedUsersDd option:selected").val() : null;

                var nextActionSt = $.trim($("#nextAction").val());
                var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }
                var sourceId = $("#sourceDd option:selected").val();
                var referredBy = $.trim($("#referredBy").val());
                var departmentId = $("#departmentDd option:selected").val();
                var jobPositionId = $("#jobPositionDd option:selected").val() ? $("#jobPositionDd option:selected").val() : null;
                var expectedSalary = $.trim($("#expectedSalary").val());
                var proposedSalary = $.trim($("#proposedSalary").val());
                var tags = $.trim($("#tags").val()).split(',');
                var otherInfo = $("#otherInfo").val();
                var workflow = $("#workflowsDd option:selected").data('id');

                this.currentModel.save({
                    subject: subject,
                    imageSrc: this.imageSrc,
                    name: name,
                    workEmail: wemail,
                    wphones: wphones,
                    degree: degreeId,
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
                }, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                        self.hideDialog();
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                        self.hideDialog();
                    }
                });

            },

            render: function () {
                var formString = this.template(this.currentModel.toJSON());
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "applications-edit-dialog",
                    width: 900,
                    title: "Edit Application",
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
                common.populateWorkflows("Application", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.relatedUsersDd, "/getPersonsForDd", this.currentModel.toJSON());
                common.populateSourceApplicants(App.ID.sourceDd, "/SourcesOfApplicants" , this.currentModel.toJSON());
                common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON());
                common.populateJobPositions(App.ID.jobPositionDd, "/JobPosition", this.currentModel.toJSON());
                common.populateDegrees(App.ID.degreesDd, "/Degrees", this.currentModel.toJSON());
                common.canvasDraw({ model: this.currentModel }, this);
                $('#nextAction').datepicker();
                return this;
            }

        });
        return EditView;
    });