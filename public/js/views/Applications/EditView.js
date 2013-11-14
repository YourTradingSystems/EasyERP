define([
    "text!templates/Applications/EditTemplate.html",
    "collections/Applications/ApplicationsCollection",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Degrees/DegreesCollection",
    "collections/SourceOfApplicants/SourceOfApplicantsCollection",
    "collections/Workflows/WorkflowsCollection",
    "common",
    "custom"
],
    function (EditTemplate, ApplicationsCollection, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, DegreesCollection, SourceOfApplicantsCollection, WorkflowsCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            imageSrc: '',

            initialize: function (options) {
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = new JobPositionsCollection();
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.degreesCollection = new DegreesCollection();
                this.degreesCollection.bind('reset', _.bind(this.render, this));
                this.sourceOfApplicantsCollection = new SourceOfApplicantsCollection();
                this.sourceOfApplicantsCollection.bind('reset', _.bind(this.render, this));
                this.workflowsCollection = new WorkflowsCollection({ id: 'application' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.applicationsCollection = options.collection;
                this.applicationsCollection.bind('reset', _.bind(this.render, this));
                //this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #refuse": "changeWorkflow",
                "click #hire": "isEmployee"
            },

            changeWorkflow: function (e) {
                var mid = 39;
                var model = {};
                var name = '', status = '';
                if ($(e.target).hasClass("applicationWorkflowLabel")) {
                    var breadcrumb = $(e.target).closest('li');
                    var a = breadcrumb.siblings().find("a");
                    if (a.hasClass("active")) {
                        a.removeClass("active");
                    }
                    breadcrumb.find("a").addClass("active");
                    name = breadcrumb.data("name");
                    status = breadcrumb.data("status");
                }
                else {
                    var workflow = this.workflowsCollection.models[this.workflowsCollection.models.length - 1];
                    console.log(workflow);
                    name = workflow.get('name');
                    status = workflow.get('status');
                }
                model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: name,
                        status: status
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }

                });

            },
            
            isEmployee: function (e) {
                var mid = 39;
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                model.set({ isEmployee: true });
                model.save({}, {
                    headers: {
                        mid: mid
                    }
                });
            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem: function () {
                var self = this;
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var subject = $.trim($("#subject").val());
                    var first = $.trim($("#first").val());
                    var last = $.trim($("#last").val());
                    var name = {
                        first: first,
                        last: last
                    };
                    var wemail = $.trim($("#wemail").val());
                    var phone = $.trim($("#phone").val());
                    var mobile = $.trim($("#mobile").val());
                    var wphones = {
                        phone: phone,
                        mobile: mobile
                    };

                    var degreeId = this.$("#degree option:selected").val();
                    var degree = {
                        id: degreeId,
                        name: degreeId
                    };

                    var relatedUserId = this.$("#relatedUser option:selected").val();
                    var _relatedUser = common.toObject(relatedUserId, this.employeesCollection);
                    var relatedUser = {};
                    if (_relatedUser) {
                        relatedUser.id = _relatedUser._id;
                        relatedUser.login = _relatedUser.name.first + ' ' + _relatedUser.name.last;
                    } else {
                        relatedUser = currentModel.defaults.relatedUser;
                    }

                    var nextActionSt = $.trim($("#nextAction").val());
                    var nextAction = "";
                    if (nextActionSt) {
                        nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                    }

                    var sourceId = this.$("#source option:selected").val();
                    var source = {
                        id: sourceId,
                        name: sourceId
                    };

                    var referredBy = $.trim($("#referredBy").val());

                    var departmentId = this.$("#department option:selected").val();
                    var _department = common.toObject(departmentId, this.departmentsCollection);
                    var department = {};
                    if (_department) {
                        department.id = _department._id;
                        department.name = _department.departmentName;
                    } else {
                        department = currentModel.defaults.department;
                    }

                    var jobId = this.$("#job option:selected").val();
                    var _jobPosition = common.toObject(jobId, this.jobPositionsCollection);
                    var jobPosition = {};
                    if (_jobPosition) {
                        jobPosition.id = _jobPosition._id;
                        jobPosition.name = _jobPosition.name;
                    } else {
                        jobPosition = currentModel.defaults.jobPosition;
                    }

                    var expectedSalary = $.trim($("#expectedSalary").val());
                    var proposedSalary = $.trim($("#proposedSalary").val());
                    var tags = $.trim($("#tags").val()).split(',');
                    var otherInfo = $("#otherInfo").val();

                    currentModel.set({
                        subject: subject,
                        imageSrc: this.imageSrc,
                        name: name,
                        wemail: wemail,
                        wphones: wphones,
                        degree: degree,
                        relatedUser: relatedUser,
                        nextAction: nextAction,
                        source: source,
                        referredBy: referredBy,
                        department: department,
                        jobPosition: jobPosition,
                        expectedSalary: expectedSalary,
                        proposedSalary: proposedSalary,
                        tags: tags,
                        otherInfo: otherInfo
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
                }
                else {
                    var currentModel = this.applicationsCollection.models[itemIndex];
                    //currentModel.on('change', this.render, this);
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(),
                        employeesCollection: this.employeesCollection,
                        jobPositionsCollection: this.jobPositionsCollection,
                        departmentsCollection: this.departmentsCollection,
                        degreesCollection: this.degreesCollection,
                        sourceOfApplicantsCollection: this.sourceOfApplicantsCollection
                    }));
                };
                common.canvasDraw({ model: currentModel.toJSON() }, this);
                $('#nextAction').datepicker();
                return this;
            }

        });
        return EditView;
    });