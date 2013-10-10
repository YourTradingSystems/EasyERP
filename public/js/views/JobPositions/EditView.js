define([
    "text!templates/JobPositions/EditTemplate.html",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "custom"
],
    function (EditTemplate, JobPositionsCollection, DepartmentsCollection, WorkflowsCollection, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Job Positions",

            initialize: function (options) {
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = options.collection;
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.workflowsCollection = new WorkflowsCollection({ id: 'jobposition' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));

                this.render();
            },

            events: {
                "click .breadcrumb a": "changeWorkflow"
            },

            changeWorkflow: function (e) {
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

            },

            saveItem: function () {

                var self = this;

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var name = $.trim($("#name").val());

                    var expectedRecruitment = $.trim($("#expectedRecruitment").val());

                    var description = $.trim($("#description").val());

                    var requirements = $.trim($("#requirements").val());

                    var departmentId = this.$("#department option:selected").val();
                    var _department = common.toObject(idManager, this.departmentsCollection);
                    var department = {};
                    if (_department) {
                        department.id = _department._id;
                        department.name = _department.departmentName;
                    } else {
                        department = currentModel.defaults.department;
                    }

                    currentModel.set({
                        name: name,
                        expectedRecruitment: expectedRecruitment,
                        description: description,
                        requirements: requirements,
                        department: department
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
                    var currentModel = this.jobPositionsCollection.models[itemIndex];
                    currentModel.on('change', this.render, this);
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), departmentsCollection: this.departmentsCollection }));
                    var workflows = this.workflowsCollection.models;

                    _.each(workflows, function (workflow, index) {
                        $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                    });

                    _.each(workflows, function (workflow, i) {
                        var breadcrumb = this.$(".breadcrumb li").eq(i);
                        if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                            breadcrumb.find("a").addClass("active");
                        }
                    }, this);
                }

                return this;
            }

        });

        return EditView;
    });