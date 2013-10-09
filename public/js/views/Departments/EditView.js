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

            initialize: function (options) {
                this.accountDdCollection = new AccountsDdCollection();
                this.accountDdCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = options.collection;
                this.departmentsCollection.bind('reset', _.bind(this.render, this));

                this.render();
            },

            saveItem: function () {

                var self = this;

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var departmentName = $.trim($("#departmentName").val());

                    var departmentId = this.$("#parentDepartment option:selected").val();
                    var _parentDepartment = common.toObject(departmentId, this.departmentsCollection);
                    var parentDepartment = {};
                    if (_parentDepartment) {
                        parentDepartment.name = _parentDepartment.departmentName;
                        parentDepartment.id = _parentDepartment._id;
                    } else {
                        parentDepartment = currentModel.defaults.parentDepartment;
                    }

                    var managerId = this.$("#departmentManager option:selected").val();
                    var _departmentManager = common.toObject(managerId, this.accountDdCollection);
                    var departmentManager = {};
                    if (_departmentManager) {
                        departmentManager.name = _departmentManager.name.first + " " + _departmentManager.name.last;
                        departmentManager.id = _departmentManager._id;
                    } else {
                        departmentManager = currentModel.defaults.departmentManager;
                    }

                    currentModel.set({
                        departmentName: departmentName,
                        parentDepartment: parentDepartment,
                        departmentManager: departmentManager
                    });

                    currentModel.save({}, {
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
                }

            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.departmentsCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), accountDdCollection: this.accountDdCollection, departmentsCollection: this.departmentsCollection }));
                }

                return this;
            }

        });

        return EditView;
    });