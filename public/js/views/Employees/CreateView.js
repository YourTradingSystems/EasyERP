define([
    "text!templates/Employees/CreateTemplate.html",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Users/UsersCollection",
    "models/EmployeeModel",
    "common",
    "custom"
],
    function (CreateTemplate, EmployeesCollection, DepartmentsCollection, JobPositionsCollection, AccountsDdCollection, UsersCollection, EmployeeModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function (options) {
                this.usersCollection = new UsersCollection();
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = new JobPositionsCollection();
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.accountsDdCollection = new AccountsDdCollection();
                this.accountsDdCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.employeesCollection = options.collection;
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

                var workAddress = {};
                $("p").find(".workAddress").each(function () {
                    var el = $(this);
                    workAddress[el.attr("name")] = el.val();
                });

                var tags = $.trim($("#tags").val()).split(',');

                var workEmail = $.trim($("#workEmail").val());

                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var workPhones = {
                    phone: phone,
                    mobile: mobile
                };

                var officeLocation = $.trim($("#officeLocation").val());

                var relatedUserId = this.$("#relatedUser option:selected").val();
                var relatedUser = common.toObject(relatedUserId, this.usersCollection);

                var departmentId = this.$("#department option:selected").val();
                var department = common.toObject(departmentId, this.departmentsCollection);

                var jobPositionId = this.$("#jobPosition option:selected").val();
                var jobPosition = common.toObject(jobPositionId, this.jobPositionsCollection);

                var managerId = this.$("#manager option:selected").val();
                var manager = common.toObject(managerId, this.accountsDdCollection);

                var coachId = this.$("#coach option:selected").val();
                var coach = common.toObject(coachId, this.accountsDdCollection);

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

                var active = ($("#active").is(":checked")) ? true : false;

                employeeModel.save({
                    name: name,
                    imageSrc: this.imageSrc,
                    workAddress: workAddress,
                    workEmail: workEmail,
                    workPhones: workPhones,
                    officeLocation: officeLocation,
                    relatedUser: relatedUser,
                    department: department,
                    jobPosition: jobPosition,
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
                var employeeModel = new EmployeeModel();
                this.$el.html(this.template({
                    departmentsCollection: this.departmentsCollection,
                    jobPositionsCollection: this.jobPositionsCollection,
                    accountsDdCollection: this.accountsDdCollection,
                    usersCollection: this.usersCollection
                }));
                common.canvasDraw({ model: employeeModel.toJSON() }, this);
                return this;
            }

        });

        return CreateView;
    });