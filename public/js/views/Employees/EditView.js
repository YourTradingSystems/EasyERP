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

            if (options.collection) {
                this.employeesCollection = options.collection;
                this.currentModel = this.employeesCollection.getElement();
            } else {
                this.currentModel = options.model;
            }

                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                'keydown': 'keydownHandler',
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
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
                var relatedUser = this.$el.find("#relatedUsersDd option:selected").val();
                relatedUser = relatedUser ? relatedUser : null;

                var department = this.$el.find("#departmentsDd option:selected").val();
                department = department ? department : null;

                var jobPosition = this.$el.find("#jobPositionDd option:selected").val();
                jobPosition = jobPosition ? jobPosition : null;

                var manager = this.$el.find("#projectManagerDD option:selected").val();
                manager = manager ? manager : null;

                var coach = $.trim(this.$el.find("#coachDd option:selected").val());
                coach = coach ? coach : null;

                var homeAddress = {};
                $("dd").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = $.trim(el.val());
                });

                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var dateBirth = "";
                if (dateBirthSt) {
                    dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
                }

                var active = (this.$el.find("#active").is(":checked")) ? true : false;

                var self = this;

                var data = {
                    name: {
                        first: $.trim(this.$el.find("#first").val()),
                        last: $.trim(this.$el.find("#last").val())
                    },
                    workAddress: {
                        street:$.trim( this.$el.find('#street').val()),
                        city: $.trim(this.$el.find('#city').val()),
                        state: $.trim(this.$el.find('#state').val()),
                        zip: $.trim(this.$el.find('#zip').val()),
                        country: $.trim(this.$el.find('#country').val())
                    },
                    tags: $.trim(this.$el.find("#tags").val()).split(','),
                    workEmail: $.trim(this.$el.find("#workEmail").val()),
                    skype: $.trim(this.$el.find("#skype").val()),
                    workPhones: {
                        phone: $.trim(this.$el.find("#phone").val()),
                        mobile: $.trim(this.$el.find("#mobile").val())
                    },
                    officeLocation: $.trim(this.$el.find("#officeLocation").val()),
                    relatedUser: relatedUser,
                    department: department,
                    jobPosition: jobPosition,
                    manager: manager,
                    coach: coach,
                    identNo: $.trim($("#identNo").val()),
                    passportNo: $.trim(this.$el.find("#passportNo").val()),
                    otherId: $.trim(this.$el.find("#otherId").val()),
                    homeAddress: homeAddress,
                    dateBirth: dateBirth,
                    active: active,
                    imageSrc: this.imageSrc
                };
                this.currentModel.save(data,{
                        headers: {
                            mid: 39
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            self.hideDialog();
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                            self.hideDialog();
                        }
                });

            },

            render: function () {
                console.log(this.currentModel.toJSON());
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
                common.populateCoachDd(App.ID.coachDd, "/getPersonsForDd", this.currentModel.toJSON());
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
