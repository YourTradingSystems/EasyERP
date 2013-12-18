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
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.employeesCollection = options.collection;
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #refuse": "changeWorkflow",
                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler',
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
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
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

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
                        Backbone.history.navigate("easyErp/Applications", { trigger: true });
                        self.hideDialog();
                    },
                    error: function () {
                        Backbone.history.navigate("easyErp", { trigger: true });
                        self.hideDialog();
                    }
                });

            },
            deleteItem: function(event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                    var answer = confirm("Realy DELETE items ?!");
                    if (answer == true) {
                        this.currentModel.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                $('.applications-edit-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.applications-edit-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },
            render: function () {
                var formString = this.template({ model: this.currentModel.toJSON() });
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
                        },
                        delete:{
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                common.populateWorkflows("Application", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.relatedUsersDd, "/getPersonsForDd", this.currentModel.toJSON());
                common.populateSourceApplicants(App.ID.sourceDd, "/SourcesOfApplicants" , this.currentModel.toJSON());
                common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON());
                common.populateJobPositions(App.ID.jobPositionDd, "/JobPosition", this.currentModel.toJSON());
                common.populateDegrees(App.ID.degreesDd, "/Degrees", this.currentModel.toJSON());
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                $('#nextAction').datepicker();
                return this;
            }

        });
        return EditView;
    });