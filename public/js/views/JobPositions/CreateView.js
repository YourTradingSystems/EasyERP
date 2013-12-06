define([
    "text!templates/JobPositions/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/JobPositionsModel",
    "common"
],
    function (CreateTemplate, DepartmentsCollection, WorkflowsCollection, JobPositionsModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new JobPositionsModel();
                this.render();
            },

            events: {
                "change #workflowNames": "changeWorkflows"
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

            saveItem: function () {

                var self = this;

                var mid = 39;
                var name = $.trim($("#name").val());
                var expectedRecruitment = parseInt($.trim($("#expectedRecruitment").val()));

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                var workflow = this.$("#workflowsDd option:selected").val();
                var department = this.$("#departmentDd option:selected").val();

                this.model.save({
                    name: name,
                    expectedRecruitment: expectedRecruitment,
                    description: description,
                    requirements: requirements,
                    department: department,
                    workflow: workflow
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						self.hideDialog();
                        Backbone.history.navigate("easyErp/JobPositions", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },
            hideDialog: function () {
                $(".create-dialog").remove();
            },

            render: function () {
				var self = this;
                var formString = this.template({});

                   this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:true,
					dialogClass:"create-dialog",
					title: "Edit Job position",
					width:"80%",
					height:460,
                    buttons: [
                        {
                            text: "Create",
                            click: function () { self.saveItem(); }
                        },

						{
							text: "Cancel",
							click: function () { $(this).dialog().remove(); }
						}]

                });
				common.populateDepartments(App.ID.departmentDd, "/Departments");
                common.populateWorkflows("Jobposition", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows");

                return this;
            }

        });

        return CreateView;
    });
