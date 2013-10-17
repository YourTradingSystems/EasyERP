define([
    "text!templates/Employees/EditTemplate.html",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Users/UsersCollection",
    "common",
    "custom"
],
    function (EditTemplate, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, UsersCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            imageSrc: '',

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
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
                
            },

            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display:"block"
                }, 250);
               
            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

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

                    var workAddress = {};
                    $("p").find(".workAddress").each(function () {
                        var el = $(this);
                        workAddress[el.attr("name")] = el.val();
                    });

                    var tags = $.trim($("#tags").val()).split(',');

                    var workEmail = $.trim($("#workEmail").val());
                    var skype = $.trim($("#skype").val());

                    var phone = $.trim($("#phone").val());
                    var mobile = $.trim($("#mobile").val());
                    var workPhones = {
                        phone: phone,
                        mobile: mobile
                    };

                    var officeLocation = $.trim($("#officeLocation").val());

                    var relatedUserId = this.$("#relatedUser option:selected").val();
                    var _relatedUser = common.toObject(relatedUserId, this.usersCollection);
                    var relatedUser = {};
                    if (_relatedUser) {
                        relatedUser.id = _relatedUser._id;
                        relatedUser.login = _relatedUser.login;
                    } else {
                        relatedUser = currentModel.defaults.relatedUser;
                    }

                    var departmentId = this.$("#department option:selected").val();
                    var _department = common.toObject(departmentId, this.departmentsCollection);
                    var department = {};
                    if (_department) {
                        department.id = _department._id;
                        department.name = _department.departmentName;
                    } else {
                        department = currentModel.defaults.department;
                    }

                    var jobPositionId = this.$("#jobPosition option:selected").val();
                    var _jobPosition = common.toObject(jobPositionId, this.jobPositionsCollection);
                    var jobPosition = {};
                    if (_jobPosition) {
                        jobPosition.id = _jobPosition._id;
                        jobPosition.name = _jobPosition.name;
                    } else {
                        jobPosition = currentModel.defaults.jobPosition;
                    }

                    var managerId = this.$("#manager option:selected").val();
                    var _manager = common.toObject(managerId, this.accountsDdCollection);
                    var manager = {};
                    if (_manager) {
                        manager.id = _manager._id;
                        manager.name = _manager.name.first + ' ' + _manager.name.last;
                    } else {
                        manager = currentModel.defaults.manager;
                    }

                    var coachId = this.$("#coach option:selected").val();
                    var _coach = common.toObject(coachId, this.accountsDdCollection);
                    var coach = {};
                    if (_coach) {
                        coach.id = _coach._id;
                        coach.name = _coach.name.first + ' ' + _coach.name.last;
                    } else {
                        coach = currentModel.defaults.coach;
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

                    var active = ($("#active").is(":checked")) ? true : false;

                    currentModel.set({
                        name: name,
                        imageSrc: this.imageSrc,
                        tags: tags,
                        workAddress: workAddress,
                        workEmail: workEmail,
                        skype: skype,
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
                        currentModel.set({
                            dateBirth: currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/')
                        }, {
                            silent: true
                        });
                    }
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(),
                        departmentsCollection: this.departmentsCollection,
                        jobPositionsCollection: this.jobPositionsCollection,
                        accountsDdCollection: this.accountsDdCollection,
                        usersCollection: this.usersCollection
                    }));
                };
                common.canvasDraw({ model: currentModel.toJSON() }, this);
                return this;
            }

        });

        return EditView;
    });