define([
    "text!templates/Employees/EditTemplate.html",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Users/UsersCollection",
    "common",
    "custom",
    "dataService"
],
    function (EditTemplate, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, UsersCollection, common, Custom, dataService) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");

                this.employeesCollection = options.collection;
                this.currentModel = this.employeesCollection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                'keydown': 'keydownHandler'
            },
            keydownHandler: function(e){
                switch (e.which){
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },
            hideDialog: function () {
                $(".edit-employee-dialog").remove();
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
                var name = {
                    first: $.trim($("#first").val()),
                    last: $.trim($("#last").val())
                };

                var workAddress = {};
                $("p").find(".workAddress").each(function () {
                    var el = $(this);
                    workAddress[el.attr("name")] = el.val();
                });

                var tags = $.trim($("#tags").val()).split(',');

                var workEmail = $.trim($("#workEmail").val());
                var skype = $.trim($("#skype").val());

                var workPhones = {
                    phone: $.trim($("#phone").val()),
                    mobile: $.trim($("#mobile").val())
                };

                var officeLocation = $.trim($("#officeLocation").val());
                var relatedUser = $("#relatedUsersDd option:selected").val();
                relatedUser = relatedUser ? relatedUser : null;
                var department = $("#departmentsDd option:selected").val();
                department = department ? department : null;
                var jobPosition = $("#jobPositionDd option:selected").val();
                jobPosition = jobPosition ? jobPosition : null;
                var manager = $("#projectManagerDD option:selected").val();
                manager = manager ? manager : null;
                var coach = $("#coachDd option:selected").val();
                coach = coach ? coach : null;
                var identNo = parseInt($.trim($("#identNo").val()));

                var passportNo = $.trim($("#passportNo").val());

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
                var self = this;
                this.currentModel.save({
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
                }, {
                    headers: {
                        mid: 39
                    },
                    wait: true,
                    success: function (model) {
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        self.hideDialog();
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                if (this.currentModel.get('dateBirth')) {
                    this.currentModel.set({
                        dateBirth: this.currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/')
                    }, {
                        silent: true
                    });
                }
                var formString = this.template(this.currentModel.toJSON());
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-employee-dialog",
                    width: 800,
                    buttons:{
                        save:{
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });
                common.populateUsers(App.ID.relatedUsersDd, "/Users", this.currentModel.toJSON());
                common.populateDepartments(App.ID.departmentsDd, "/Departments",this.currentModel.toJSON());
                common.populateJobPositions(App.ID.jobPositionDd, "/JobPosition", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.coachDd, "/getPersonsForDd", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.managerSelect, "/getPersonsForDd", this.currentModel.toJSON());
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                $('#dateBirth').datepicker({
                    changeMonth : true,
                    changeYear : true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-1d'
                });
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });