define([
    "text!templates/Companies/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "models/CompaniesModel",
    "common",
    "custom"
],
    function (CreateTemplate, CompaniesCollection, EmployeesCollection, DepartmentsCollection, CompanyModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new CompanyModel();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
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
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },
            hideDialog: function () {
                $(".create-dialog").remove();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var companyModel = new CompanyModel();

                var name = {
                    first: $.trim(this.$el.find("#name").val()),
                    last:''
                };

                var address = {};
                this.$el.find(".person-info").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var email = $.trim(this.$el.find("#email").val());

                var phone = $.trim(this.$el.find("#phone").val());

                var mobile = $.trim(this.$el.find("#mobile").val());

                var fax = $.trim(this.$el.find("#fax").val());

                var website = $.trim(this.$el.find("#website").val());

                var internalNotes = $.trim(this.$el.find("#internalNotes").val());

                var salesPerson = this.$("#employeesDd option:selected").val();
                //var salesPerson = common.toObject(salesPersonId, this.employeesCollection);

                var salesTeam = this.$("#departmentDd option:selected").val();
                //var salesTeam = common.toObject(salesTeamId, this.departmentsCollection);

                var reference = $.trim(this.$el.find("#reference").val());

                var language = $.trim(this.$el.find("#language").val());

                var isCustomer = (this.$el.find("#isCustomer").is(":checked")) ? true : false;

                var isSupplier = (this.$el.find("#isSupplier").is(":checked")) ? true : false;

                var active = (this.$el.find("#active").is(":checked")) ? true : false;

                companyModel.save({
                    name: name,
                    imageSrc: this.imageSrc,
                    email: email,
                    phones: {
                        phone: phone,
                        mobile: mobile,
                        fax: fax
                    },
                    address: address,
                    website: website,
                    internalNotes: internalNotes,
                    salesPurchases: {
                        isCustomer: isCustomer,
                        isSupplier: isSupplier,
                        active: active,
                        salesPerson: salesPerson,
                        salesTeam: salesTeam,
                        reference: reference,
                        language: language
                    }
                },
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
							self.hideDialog();
							Backbone.history.navigate("easyErp/Companies", { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });

            },

            render: function () {
                var companyModel = new CompanyModel();
                var formString = this.template({});
				var self = this;
                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:true,
					dialogClass:"create-dialog",
					title: "Edit Company",
					width:"55%",
                    buttons: [
                        {
                            text: "Create",
                            click: function () { self.saveItem(); }
                        },

						{
							text: "Cancel",
							click: function () { $(this).dialog().remove(); }
						}]

                });
                common.populateDepartments(App.ID.departmentDd, "/Departments");
                common.populateEmployeesDd(App.ID.employeesDd, "/Employees");
                common.canvasDraw({ model: companyModel.toJSON() }, this);
                this.$el.find('#date').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                return this;
            }

        });

        return CreateView;
    });
