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

                var relatedUser = this.$el.find("#relatedUsersDd option:selected").val();
                relatedUser = relatedUser ? relatedUser : null;

                var department = this.$el.find("#departmentsDd option:selected").val();
                department = department ? department : null;

                var nextActionSt = $.trim(this.$el.find("#nextAction").val());
                var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }
                var jobPositionId = this.$el.find("#jobPositionDd option:selected").val() ? this.$el.find("#jobPositionDd option:selected").val() : null;

                var data = {
                    subject: this.$el.find("#subject").val(),
                    imageSrc: this.imageSrc,
                    name: {
                        first: this.$el.find("#first").val(),
                        last: this.$el.find("#last").val()
                    },
                    workEmail: $.trim(this.$el.find("#wemail").val()),
                    workPhones: {
                        phone: $.trim(this.$el.find("#phone").val()),
                        mobile: $.trim(this.$el.find("#mobile").val())
                    },
                    degree: this.$el.find("#degreesDd option:selected").val(),
                    relatedUser:relatedUser,
                    nextAction: nextAction,
                    source: {
                        id: this.$el.find("#sourceDd option:selected").val()
                    },
                    referredBy: $.trim(this.$el.find("#referredBy").val()),
                    department: department,
                    jobPosition: jobPositionId,
                    expectedSalary: $.trim(this.$el.find("#expectedSalary").val()),
                    proposedSalary: $.trim(this.$el.find("#proposedSalary").val()),
                    tags: $.trim(this.$el.find("#tags").val()).split(','),
                    otherInfo: this.$el.find("#otherInfo").val(),
                    workflow: this.$el.find("#workflowsDd option:selected").val() ? this.$el.find("#workflowsDd option:selected").val() : null
                };

                this.currentModel.save(data, {
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
                console.log(this.currentModel.toJSON());
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