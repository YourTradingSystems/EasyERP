define([
    "text!templates/JobPositions/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/JobPositionModel",
    "common"
],
    function (CreateTemplate, DepartmentsCollection, WorkflowsCollection, JobPositionModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",
            template: _.template(CreateTemplate),

            initialize: function (options) {
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

                var jobPositionModel = new JobPositionModel();

                var name = $.trim($("#name").val());

                var expectedRecruitment = parseInt($.trim($("#expectedRecruitment").val()));

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                /*var workflow = {
                    wName: this.$("#workflowNames option:selected").text(),
                    name: this.$("#workflow option:selected").text(),
                    status: this.$("#workflow option:selected").val(),
                };*/
                var workflow = this.$("#workflowsDd option:selected").val();
                //var departmentId = this.$("#department option:selected").val();
                //var objDepartment = this.departmentsCollection.get(departmentId);
                //var department = {};
                //if (objDepartment) {
                //    department.name = objDepartment.get('departmentName');
                //    department.id = departmentId;
                //}
                var department = this.$("#departmentDd option:selected").val();
                //var department = common.toObject(departmentId, this.departmentsCollection);

                console.log(department);

                jobPositionModel.save({
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
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
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
