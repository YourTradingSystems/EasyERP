define([
    "text!templates/Departments/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "models/DepartmentModel",
    "common",
    "custom"
],
    function (CreateTemplate, DepartmentsCollection, AccountsDdCollection, DepartmentModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.accountDdCollection = new AccountsDdCollection();
                this.accountDdCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var self = this;

                var mid = 39;

                var departmentModel = new DepartmentModel();

                var departmentName = $.trim($("#departmentName").val());

                var departmentId = this.$("#parentDepartment option:selected").val();
                var objParentDepartment = common.toObject(departmentId, this.departmentsCollection);
                var parentDepartment = {};
                if (objParentDepartment !== "{}") {
                    parentDepartment.departmentName = objParentDepartment.get('departmentName');
                    parentDepartment.departmentId = departmentId;
                }

                var managerId = this.$("#departmentManager option:selected").val();
                var objDepartmentManager = common.toObject(managerId, this.accountDdCollection);
                var departmentManager = {};
                if (objDepartmentManager !== "{}") {
                    departmentManager.name = objDepartmentManager.get('name').first + " " + objDepartmentManager.get('name').last;
                    departmentManager.id = managerId;
                }

                departmentModel.save({
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
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                this.$el.html(this.template({ accountDdCollection: this.accountDdCollection, departmentsCollection: this.departmentsCollection }));
                return this;
            }

        });

        return CreateView;
    });