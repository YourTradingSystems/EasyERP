define([
    "text!templates/ownCompanies/CreateTemplate.html",
    "collections/ownCompanies/CompaniesCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "models/CompaniesModel",
    "common",
    "custom"
],
    function (CreateTemplate, CompaniesCollection, EmployeesCollection, DepartmentsCollection, CompanyModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new CompanyModel();
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
            hideDialog: function () {
                $(".create-dialog").remove();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var companyModel = new CompanyModel();

                var name = {
                    first: $("#name").val(),
                    last:''
                };

                var address = {};
                $(".person-info").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = el.val();
                });

                var email = $("#email").val();

                var phone = $("#phone").val();

                var mobile = $("#mobile").val();

                var fax = $("#fax").val();

                var website = $("#website").val();

                var internalNotes = $.trim($("#internalNotes").val());

                var salesPerson = this.$("#employeesDd option:selected").val();
                //var salesPerson = common.toObject(salesPersonId, this.employeesCollection);

                var salesTeam = this.$("#departmentDd option:selected").val();
                //var salesTeam = common.toObject(salesTeamId, this.departmentsCollection);

                var reference = $("#reference").val();

                var language = $("#language").val();

                var isCustomer = ($("#isCustomer").is(":checked")) ? true : false;

                var isSupplier = ($("#isSupplier").is(":checked")) ? true : false;

                var active = ($("#active").is(":checked")) ? true : false;

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
                    isOwn:true,
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
							Backbone.history.navigate("easyErp/ownCompanies", { trigger: true });
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
                $('#date').datepicker({ dateFormat: "d M, yy" });
                return this;
            }

        });

        return CreateView;
    });
