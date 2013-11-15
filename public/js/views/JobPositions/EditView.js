define([
    "text!templates/JobPositions/EditTemplate.html",
    "text!templates/JobPositions/editSelectTemplate.html",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "custom",
    'common'
],
    function (EditTemplate, editSelectTemplate, JobPositionsCollection, DepartmentsCollection, WorkflowsCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",

            initialize: function (options) {
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = options.collection;
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.workflowsCollection = new WorkflowsCollection({ id: 'Job Position' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render = _.after(3, this.render);
            },

            events: {
                "click .breadcrumb a": "changeWorkflow",
                "change #workflowNames": "changeWorkflows"
            },

            changeWorkflows: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.collection.models[itemIndex].toJSON();
                    var name = this.$("#workflowNames option:selected").val();
                    var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                    $("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(value) }));
                }
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
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

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var name = $.trim($("#name").val());

                    var expectedRecruitment = $.trim($("#expectedRecruitment").val());

                    var description = $.trim($("#description").val());

                    var requirements = $.trim($("#requirements").val());

                    var departmentId = this.$("#department option:selected").val();
                    var _department = common.toObject(departmentId, this.departmentsCollection);
                    var department = {};
                    if (_department) {
                        department.id = _department._id;
                        department.name = _department.departmentName;
                    } else {
                        department = currentModel.defaults.department;
                    }

                    var workflow = {
                        wName: this.$("#workflowNames option:selected").text(),
                        name: this.$("#workflow option:selected").text(),
                        status: this.$("#workflow option:selected").val(),
                    };

                    currentModel.set({
                        name: name,
                        expectedRecruitment: expectedRecruitment,
                        description: description,
                        requirements: requirements,
                        department: department,
                        workflow: workflow
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
                    var workflowModel = this.workflowsCollection.findWhere({ name: currentModel.toJSON().workflow.wName });
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(),
                        departmentsCollection: this.departmentsCollection,
                        workflowsCollection: this.workflowsCollection
                    }));
                    
                    $("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(workflowModel.toJSON().value) }));

                    /*var workflows = this.workflowsCollection.models;

                    _.each(workflows, function (workflow, index) {
                        $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                    });

                    _.each(workflows, function (workflow, i) {
                        var breadcrumb = this.$(".breadcrumb li").eq(i);
                        if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                            breadcrumb.find("a").addClass("active");
                        }
                    }, this);*/
                }
                return this;
            }

        });

        return EditView;
    });