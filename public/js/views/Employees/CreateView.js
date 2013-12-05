define([
    "text!templates/Employees/CreateTemplate.html",
    "models/EmployeesModel",
    "common",
    "custom"
],
    function (CreateTemplate, EmployeeModel, common, custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function (options) {
                _.bindAll(this, "saveItem");
                this.model = new EmployeeModel();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
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
                var mid = 39;
                var employeeModel = new EmployeeModel();
                var name = {
                    first: $.trim($("#first").val()),
                    last: $.trim($("#last").val())
                };
                var workAddress = {};
                $("dd").find(".workAddress").each(function () {
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
                var relatedUser = $("#relatedUsersDd option:selected").val();
                var department = $("#departmentsDd option:selected").val();
                var jobPosition = $("#jobPositionDd option:selected").val();
                var manager = $("#projectManagerDD option:selected").val();
                var coach = $("#coachDd option:selected").val();
                var identNo = $.trim($("#identNo").val());

                var passportNo = $.trim($("#passportNo").val());
                var otherId = $.trim($("#otherId").val());
                var homeAddress = {};
                $("dd").find(".homeAddress").each(function () {
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
                    skype: skype,
                    workPhones: workPhones,
                    officeLocation: officeLocation,
                    relatedUser: relatedUser ? relatedUser : "",
                    department: department,
                    jobPosition: jobPosition? jobPosition : "",
                    manager: manager ? manager : "",
                    coach: coach ? coach : "",
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
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
            },
                    error: function () {
                        self.hideDialog();
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: "Create Employee",
                    buttons:{
                        save:{
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });
                common.populateUsers(App.ID.relatedUsersDd, "/Users");
                common.populateDepartments(App.ID.departmentsDd, "/Departments");
                common.populateJobPositions(App.ID.jobPositionDd, "/JobPosition");
                common.populateEmployeesDd(App.ID.coachDd, "/getPersonsForDd");
                common.populateEmployeesDd(App.ID.managerSelect, "/getPersonsForDd");
                common.canvasDraw({ model: this.model.toJSON() }, this);
                $('#dateBirth').datepicker({
                    changeMonth : true,
                    changeYear : true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-1d'
                });
                return this;
            }

        });

        return CreateView;
    });
