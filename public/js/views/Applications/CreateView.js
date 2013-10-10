define([
    "text!templates/Applications/CreateTemplate.html",
    "collections/Applications/ApplicationsCollection",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Degrees/DegreesCollection",
    "collections/SourceOfApplicants/SourceOfApplicantsCollection",
    "models/ApplicationModel",
    "common",
    "custom"
],
    function (CreateTemplate, ApplicationsCollection, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, DegreesCollection, SourceOfApplicantsCollection, ApplicationModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            template: _.template(CreateTemplate),

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
                this.bind('reset', _.bind(this.render, this));
                this.applicationsCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            events: {
                "click #tabList a": "switchTab"
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

                var degreeId = this.$("#degree option:selected").val();
                var degree = {
                    id: degreeId,
                    name: degreeId
                };

                var relatedUserId = this.$("#relatedUser option:selected").val();
                var relatedUser = common.toObject(relatedUserId, this.employeesCollection);

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
                var department = common.toObject(departmentId, this.departmentsCollection);

                var jobId = this.$("#job option:selected").val();
                var jobPosition = common.toObject(jobId, this.jobPositionsCollection);

                var expectedSalary = $.trim($("#expectedSalary").val());
                var proposedSalary = $.trim($("#proposedSalary").val());
                var tags = $.trim($("#tags").val()).split(',');
                var otherInfo = $("#otherInfo").val();

                applicationModel.save({
                    subject: subject,
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
                this.$el.html(this.template({ employeesCollection: this.employeesCollection, jobPositionsCollection: this.jobPositionsCollection, departmentsCollection: this.departmentsCollection, degreesCollection: this.degreesCollection, sourceOfApplicantsCollection: this.sourceOfApplicantsCollection }));
                return this;
            }

        });

        return CreateView;
    });