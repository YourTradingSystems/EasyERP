define([
    "text!templates/Employees/CreateTemplate.html",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Users/UsersCollection",
    "models/EmployeeModel",
    "custom"
],
    function (CreateTemplate, EmployeesCollection, DepartmentsCollection, JobPositionsCollection, AccountsDdCollection, UsersCollection, EmployeeModel, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.usersCollection = new UsersCollection();
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = new JobPositionsCollection();
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.accountsDdCollection = new AccountsDdCollection();
                this.accountsDdCollection.bind('reset',  _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.employeesCollection = options.collection;
                //this.render();
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

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var employeeModel = new EmployeeModel();

                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var name = {
                    first: first,
                    last: last
                };

                var waddress = {};
                $("p").find(".waddress").each(function () {
                    var el = $(this);
                    waddress[el.attr("name")] = el.val();
                });

                var wemail = $.trim($("#wemail").val());

                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var wphones = {
                    phone: phone,
                    mobile: mobile
                };

                var officeLocation = $.trim($("#officeLocation").val());

                var relatedUserId = this.$("#relatedUser option:selected").val();
                var objRelatedUser = this.usersCollection.get(relatedUserId);
                var relatedUser = {};
                if (objRelatedUser) {
                    relatedUser.id = relatedUserId;
                    relatedUser.login = objRelatedUser.get('ulogin');
                }

                var departmentId = this.$("#department option:selected").val();
                var objDepartment = this.departmentsCollection.get(departmentId);
                var department = {};
                if (objDepartment) {
                    department.departmentName = objDepartment.get('departmentName');
                    department.departmentId = departmentId;
                }

                var jobId = this.$("#job option:selected").val();
                var objJob = this.jobPositionsCollection.get(jobId);
                var job = {};
                if (objJob) {
                    job.jobPositionId = jobId;
                    job.jobPositionName = objJob.get('name');
                }

                var managerId = this.$("#manager option:selected").val();
                var objManager = this.accountsDdCollection.get(managerId);
                var manager = {};
                if (objManager) {
                    manager.employeeName = objManager.get('name').first + " " + objManager.get('name').last;
                    manager.employeeId = managerId;
                }

                var coachId = this.$("#coach option:selected").val();
                var objCoach = this.accountsDdCollection.get(coachId);
                var coach = {};
                if (objCoach) {
                    coach.employeeName = objCoach.get('name').first + " " + objCoach.get('name').last;
                    coach.employeeId = coachId;
                }

                var identNo = parseInt($.trim($("#identNo").val()));

                var passportNo = parseInt($.trim($("#passportNo").val()));

                var otherId = $.trim($("#otherId").val());

                var homeAddress = {};
                $("p").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = el.val();
                });

                var dateBirthSt = $.trim($("#dateBirth").val());
                var dateBirth = "";
                if (dateBirthSt) {
                    dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
                }

                var active;
                if ($("#active").is(":checked")) { console.log("true"); active = true; }
                else { active = false; }

                employeeModel.save({
                    name: name,
                    waddress: waddress,
                    wemail: wemail,
                    wphones: wphones,
                    officeLocation: officeLocation,
                    relatedUser: relatedUser,
                    department: department,
                    job: job,
                    manager: manager,
                    coach: coach,
                    identNo: identNo,
                    passportNo: passportNo,
                    otherId: otherId,
                    homeAddress: homeAddress,
                    dateBirth: dateBirth,
                    active: active
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
                this.$el.html(this.template({ departmentsCollection: this.departmentsCollection, jobPositionsCollection: this.jobPositionsCollection, accountsDdCollection: this.accountsDdCollection, usersCollection: this.usersCollection }));
                return this;
            }

        });

        return CreateView;
    });