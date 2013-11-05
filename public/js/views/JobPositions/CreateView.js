define([
    "text!templates/JobPositions/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "models/JobPositionModel",
    "common"
],
    function (CreateTemplate, DepartmentsCollection, JobPositionModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                //this.bind('reset', _.bind(this.render, this));
                //    this.jobPositionsCollection = options.collection;
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var self = this;

                var mid = 39;

                var jobPositionModel = new JobPositionModel();

                var name = $.trim($("#name").val());

                var expectedRecruitment = parseInt($.trim($("#expectedRecruitment").val()));

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                //var departmentId = this.$("#department option:selected").val();
                //var objDepartment = this.departmentsCollection.get(departmentId);
                //var department = {};
                //if (objDepartment) {
                //    department.name = objDepartment.get('departmentName');
                //    department.id = departmentId;
                //}
                var departmentId = $("#department option:selected").val();
                var department = common.toObject(departmentId, this.departmentsCollection);

                console.log(department);

                jobPositionModel.save({
                    name: name,
                    expectedRecruitment: expectedRecruitment,
                    description: description,
                    requirements: requirements,
                    department: department
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
                this.$el.html(this.template({ departmentsCollection: this.departmentsCollection }));
                return this;
            }

        });

        return CreateView;
    });