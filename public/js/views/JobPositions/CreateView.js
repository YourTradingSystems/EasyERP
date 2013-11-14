define([
    "text!templates/JobPositions/CreateTemplate.html",
    "text!templates/JobPositions/selectTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/JobPositionModel",
    "common"
],
    function (CreateTemplate, selectTemplate, DepartmentsCollection, WorkflowsCollection, JobPositionModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                //this.bind('reset', _.bind(this.render, this));
                //    this.jobPositionsCollection = options.collection;
                this.workflowsCollection = new WorkflowsCollection({ id: 'Job Position' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.render = _.after(2, this.render);
            },

            close: function () {
                this._modelBinder.unbind();
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
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
            },

            saveItem: function () {

                var self = this;

                var mid = 39;

                var jobPositionModel = new JobPositionModel();

                var name = $.trim($("#name").val());

                var expectedRecruitment = parseInt($.trim($("#expectedRecruitment").val()));

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                var workflow = {
                    wName: this.$("#workflowNames option:selected").text(),
                    name: this.$("#workflow option:selected").text(),
                    status: this.$("#workflow option:selected").val(),
                };

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
                    department: department,
                    workflow: workflow
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
                var workflowNames = [];
                this.workflowsCollection.models.forEach(function (option) {
                    workflowNames.push(option.get('name'));
                });
                this.$el.html(this.template({
                    departmentsCollection: this.departmentsCollection,
                    workflowNames: workflowNames
                }));
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(this.workflowsCollection.models[0].get('value')) }));
                return this;
            }

        });

        return CreateView;
    });