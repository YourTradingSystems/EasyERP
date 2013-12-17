define([
    "text!templates/Departments/EditTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "common",
    "custom"
],
    function (EditTemplate, DepartmentsCollection, AccountsDdCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                this.departmentsCollection = new DepartmentsCollection();
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            saveItem: function () {

                var self = this;
                var mid = 39;
                var departmentName = $.trim($("#departmentName").val());
                
                var parentDepartment = this.$("#parentDepartment option:selected").val();
				if (parentDepartment==""){
					parentDepartment = null;
				}

                var departmentManager = this.$("#departmentManager option:selected").val();
				if (departmentManager==""){
					departmentManager = null;
				}
                //var _departmentManager = common.toObject(managerId, this.accountDdCollection);
                //var departmentManager = {};
                //if (_departmentManager) {
                //    departmentManager.name = _departmentManager.name.first + " " + _departmentManager.name.last;
                //    departmentManager.id = _departmentManager._id;
                //} else {
                //    departmentManager = currentModel.defaults.departmentManager;
                //}

                this.currentModel.set({
                    departmentName: departmentName,
                    parentDepartment: parentDepartment,
                    departmentManager: departmentManager
                });

                this.currentModel.save({}, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						self.hideDialog();
                        Backbone.history.navigate("#easyErp/Departments", { trigger: true });
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
                var formString = this.template({
                    model: this.currentModel.toJSON(),
                });
				var self=this;
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    dialogClass: "create-dialog",
                    width: "80%",
                    title: "Edit Department",
                    buttons: [{
								  text: "Save",
								  click: function () { self.saveItem(); }
							  },
							  {
								  text: "Cancel",
								  click: function () { $(this).remove(); }
							  }]
                });
				common.populateDepartments(App.ID.parentDepartment, "/Departments", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.departmentManager, "/getPersonsForDd", this.currentModel.toJSON());

                return this;
            }

        });

        return EditView;
    });
