define([
    "text!templates/Employees/EditTemplate.html",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Users/UsersCollection",
    "custom"
],
    function (EditTemplate, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, UsersCollection, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",

            initialize: function (options) {
                this.usersCollection = new UsersCollection();
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = new JobPositionsCollection();
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.accountsDdCollection = new AccountsDdCollection();
                this.accountsDdCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = options.collection;
                this.employeesCollection.bind('reset', _.bind(this.render, this));

                this.render();
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
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

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
                    console.log(homeAddress);

                    var dateBirthSt = $.trim($("#dateBirth").val());
                    var dateBirth = "";
                    if (dateBirthSt) {
                        dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
                    }

                    var active;
                    if ($("#active").is(":checked")) { console.log("true"); active = true; }
                    else { active = false; }

                    currentModel.set({
                        name: name,
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
                        dateBirth: dateBirth,
                        active: active
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
                    var currentModel = this.collection.models[itemIndex];
                    if (currentModel.get('dateBirth')) {
                        currentModel.set({ dateBirth: currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/') }, { silent: true });
                    }
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), departmentsCollection: this.departmentsCollection, jobPositionsCollection: this.jobPositionsCollection, accountsDdCollection: this.accountsDdCollection, usersCollection: this.usersCollection }));
                }

                return this;
            }

        });

        return EditView;
    });