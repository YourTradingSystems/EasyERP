define([
    "text!templates/JobPositions/EditTemplate.html",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "custom",
    'common'
],
    function (EditTemplate, JobPositionsCollection, DepartmentsCollection, WorkflowsCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",
            template: _.template(EditTemplate),

            initialize: function (options) {
				this.jobPositionsCollection = options.collection;
                this.currentModel = this.jobPositionsCollection.getElement();
                this.render();
            },

            events: {
                "click .breadcrumb a": "changeWorkflow"
            },

            /*changeWorkflow: function (e) {
                var mid = 39;
                var breadcrumb = $(e.target).closest('li');
                var a = breadcrumb.siblings().find("a");
                if (a.hasClass("active")) {
                    a.removeClass("active");
                }
                breadcrumb.find("a").addClass("active");
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: breadcrumb.data("name"),
                        status: breadcrumb.data("status")
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }

                });

            },*/

            saveItem: function () {
                var self = this;

                var mid = 39;

                var name = $.trim($("#name").val());

                var expectedRecruitment = $.trim($("#expectedRecruitment").val());

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                var department = this.$("#departmentDd option:selected").val();
				if (department==""){
					department=null;
				}
                //var _department = common.toObject(departmentId, this.departmentsCollection);
                //var department = {};
                //if (_department) {
                //    department.id = _department._id;
                //    department.name = _department.departmentName;
                //} else {
                //    department = currentModel.defaults.department;
                //}

/*                var workflow = {
                    wName: this.$("#workflowNames option:selected").text(),
                    name: this.$("#workflow option:selected").text(),
                    status: this.$("#workflow option:selected").val(),
                };*/
                var workflow = this.$("#workflowsDd option:selected").val();
                this.currentModel.set({
                    name: name,
                    expectedRecruitment: expectedRecruitment,
                    description: description,
                    requirements: requirements,
                    department: department,
                    workflow: workflow
                });

                this.currentModel.save({}, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						self.hideDialog()
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },
            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            render: function () {
				var self = this;
                var formString = this.template({
                    model: this.currentModel.toJSON(),
				
				});
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    dialogClass: "edit-dialog",
                    width: "70%",
                    height: 513,
                    title: "Edit Job Position",
                    buttons: [ 
						{
                            text: "Save",
                            click: function () { self.saveItem(); }
                        },
						
						{
							text: "Cancel",
							click: function () { $(this).dialog().remove(); }
						}
                    ],



                });
				common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON());
                common.populateWorkflows("Jobposition", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());
                return this;
            }

        });

        return EditView;
    });
