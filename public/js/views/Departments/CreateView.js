define([
    "text!templates/Departments/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "models/DepartmentsModel",
    "common",
    "custom"
],
    function (CreateTemplate, DepartmentsCollection, AccountsDdCollection, DepartmentsModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.departmentsCollection = new DepartmentsCollection();
                this.model = new DepartmentsModel();
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var self = this;

                var mid = 39;
                var departmentName = $.trim($("#departmentName").val());
                
                var parentDepartment = this.$("#parentDepartment option:selected").val();
                //var _parentDepartment = common.toObject(departmentId, this.departmentsCollection);
     
                var departmentManager = this.$("#departmentManager option:selected").val();
                //var departmentManager = common.toObject(managerId, this.accountDdCollection);
                
                this.model.save({
                    departmentName: departmentName,
                    parentDepartment: parentDepartment,
                    departmentManager: departmentManager
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						self.hideDialog();
                        Backbone.history.navigate("easyErp/Departments", { trigger: true });
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
					title: "Edit department",
					width:"80%",
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
				common.populateDepartments(App.ID.parentDepartment, "/Departments");
                common.populateEmployeesDd(App.ID.departmentManager, "/getPersonsForDd");
                return this;
            }

        });

        return CreateView;
    });
