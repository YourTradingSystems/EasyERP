define([
    "text!templates/Applications/CreateTemplate.html",
    "text!templates/Applications/selectTemplate.html",
    "collections/Applications/ApplicationsCollection",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Degrees/DegreesCollection",
    "collections/SourceOfApplicants/SourceOfApplicantsCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/ApplicationModel",
    "common"
],
    function (CreateTemplate, selectTemplate, ApplicationsCollection, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, DegreesCollection, SourceOfApplicantsCollection, WorkflowsCollection, ApplicationModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function (options) {
                this.workflowsCollection = new WorkflowsCollection({ id: 'Application' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
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
                this.bind('reset', _.bind(this.render, this));
                this.applicationsCollection = options.collection;
                this.render = _.after(6, this.render);
            },

            close: function () {
                this._modelBinder.unbind();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #hire": "isEmployee",
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

            isEmployee: function (e) {
                $(e.target).addClass("pressed");
                this.saveItem();
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
                var mid = 39;

                var isEmployee = false;

                if (this.$("#hire>span").hasClass("pressed")) {
                    isEmployee = true;
                    self.contentType = "Employees";
                }
                var applicationModel = new ApplicationModel();

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

                //var workflow = {
                //    wName: this.$("#workflowNames option:selected").text(),
                //    name: this.$("#workflow option:selected").text(),
                //    status: this.$("#workflow option:selected").val(),
                //};
                var workflow = this.$("#workflow option:selected").data("id");
                //var degreeId = this.$("#degree option:selected").val();
                //var degree = {
                //    id: degreeId,
                //    name: degreeId
                //};

                var relatedUserId = this.$("#relatedUser option:selected").val();
                //var relatedUser = common.toObject(relatedUserId, this.employeesCollection);

                var nextActionSt = $.trim($("#nextAction").val());
                var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }

                var sourceId = this.$("#source option:selected").val();
                //var source = {
                //    id: sourceId,
                //    name: sourceId
                //};

                var referredBy = $.trim($("#referredBy").val());

                var departmentId = this.$("#department option:selected").val();
                //var department = common.toObject(departmentId, this.departmentsCollection);

                var jobId = this.$("#job option:selected").val();
                //var jobPosition = common.toObject(jobId, this.jobPositionsCollection);

                var expectedSalary = $.trim($("#expectedSalary").val());
                var proposedSalary = $.trim($("#proposedSalary").val());
                var tags = $.trim($("#tags").val()).split(',');
                var otherInfo = $("#otherInfo").val();

                applicationModel.save({
                    isEmployee: isEmployee,
                    subject: subject,
                    imgSrc: this.imageSrc,
                    name: name,
                    wemail: wemail,
                    wphones: wphones,
                    //degree: degree,
                    relatedUser: relatedUserId,
                    nextAction: nextAction,
                    source: sourceId,
                    referredBy: referredBy,
                    department: departmentId,
                    jobPosition: jobId,
                    expectedSalary: expectedSalary,
                    proposedSalary: proposedSalary,
                    tags: tags,
                    otherInfo: otherInfo,
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
                    workflowNames.push(option.get('wName'));
                });
                workflowNames = _.uniq(workflowNames);
                var applicationModel = new ApplicationModel();
                this.$el.html(this.template({
                    employeesCollection: this.employeesCollection,
                    jobPositionsCollection: this.jobPositionsCollection,
                    departmentsCollection: this.departmentsCollection,
                    degreesCollection: this.degreesCollection,
                    sourceOfApplicantsCollection: this.sourceOfApplicantsCollection,
                    workflowNames: workflowNames
                }));
                common.canvasDraw({ model: applicationModel.toJSON() }, this);
                $('#nextAction').datepicker();
                //$("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(this.workflowsCollection.models[0].get('value')) }));
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.workflowsCollection.toJSON() }));
                return this;
            }

        });

        return CreateView;
    });