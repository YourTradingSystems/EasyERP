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
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
				if (options.myModel){
					this.currentModel = options.myModel
				}
				else{
					this.currentModel = (options.model) ? options.model : options.collection.getElement();
				}
                this.render();
            },

            events: {
                "click .breadcrumb a": "changeWorkflow",
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
                    department: department || null,
                    workflow: workflow || null
                });

                this.currentModel.save({}, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        model = model.toJSON();
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/JobPositions", { trigger: true });

                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },
            hideDialog: function () {
                $(".edit-dialog").remove();
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
                                $('.edit-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },
            render: function () {
				var self = this;
                var formString = this.template({
                    model: this.currentModel.toJSON()
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
						},
						{
							text: "Delete",
							click:self.deleteItem }
						
                    ]
                });
				common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON());
                common.populateWorkflows("Jobposition", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());
                return this;
            }

        });

        return EditView;
    });
