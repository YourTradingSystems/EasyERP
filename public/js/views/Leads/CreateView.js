define([
    "text!templates/Leads/CreateTemplate.html",
    "collections/Leads/LeadsCollection",
    "collections/Companies/CompaniesCollection",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Priority/TaskPriority",
    "models/LeadModel",
    "custom"
],
    function (CreateTemplate, LeadsCollection, CompaniesCollection, CustomersCollection, EmployeesCollection, DepartmentsCollection, PriorityCollection, LeadModel, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
                this.customersCollection = new CustomersCollection();
                this.customersCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.contentCollection = options.collection;
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

                var mid = 39;

                var model = new LeadModel();

                var name = $.trim($("#name").val());

                var companyId = this.$("#company option:selected").val();
                var objCompany = this.companiesCollection.get(companyId);
                var company = {};
                if (objCompany) {
                    company.id = companyId;
                    company.name = objCompany.get('cname');
                }

                var customerId = this.$("#customer option:selected").val();
                var objCustomer = this.customersCollection.get(customerId);
                var customer = {};
                if (objCustomer) {
                    customer.id = customerId;
                    customer.name = objCustomer.get('name').first + " " + objCustomer.get('name').last;
                }

                var address = {};
                $("p").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = el.val();
                });

                var salesPersonId = this.$("#salesPerson option:selected").val();
                var objSalesPerson = this.employeesCollection.get(salesPersonId);
                var salesPerson = {};
                if (objSalesPerson) {
                    salesPerson.id = salesPersonId;
                    salesPerson.name = objSalesPerson.get('name').first + " " + objSalesPerson.get('name').last;
                }

                var salesTeamId = this.$("#salesTeam option:selected").val();
                var objSalesTeam = this.departmentsCollection.get(salesTeamId);
                var salesTeam = {};
                if (objSalesTeam) {
                    salesTeam.id = salesTeamId;
                    salesTeam.name = objSalesTeam.get('departmentName');
                }

                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var contactName = {
                    first: first,
                    last: last
                };

                var email = $.trim($("#email").val());
                var func = $.trim($("#func").val());
                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var phones = {
                    phone: phone,
                    mobile: mobile
                };

                var fax = $.trim($("#fax").val());

                var priority = $("#priority").val();

                var internalNotes = $.trim($("#internalNotes").val());

                var active;
                if ($("#active").is(":checked")) { active = true; }
                else { active = false; }

                var optout;
                if ($("#optout").is(":checked")) { optout = true; }
                else { optout = false; }

                var reffered = $.trim($("#reffered").val());

                model.save({
                    name: name,
                    company: company,
                    customer: customer,
                    address: address,
                    salesPerson: salesPerson,
                    salesTeam: salesTeam,
                    contactName: contactName,
                    email: email,
                    func: func,
                    phones: phones,
                    fax: fax,
                    priority: priority,
                    internalNotes: internalNotes,
                    active: active,
                    optout: optout,
                    reffered: reffered
                },
                {
                    headers: {
                        mid: mid
                    }
                });

                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });

            },

            render: function () {
                this.$el.html(this.template({ companiesCollection: this.companiesCollection, customersCollection: this.customersCollection, employeesCollection: this.employeesCollection, departmentsCollection: this.departmentsCollection, priorityCollection: this.priorityCollection }));
                return this;
            }

        });
        return CreateView;
    });