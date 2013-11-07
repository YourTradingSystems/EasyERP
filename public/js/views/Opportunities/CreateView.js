define([
    "jqueryui",
    "text!templates/Opportunities/CreateTemplate.html",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Priority/TaskPriority",
    "models/OpportunityModel",
    "common",
    "custom"
],
    function (jqueryui, CreateTemplate, CustomersCollection, EmployeesCollection, DepartmentsCollection, PriorityCollection, OpportunityModel, common, Custom) {
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(CreateTemplate),

            initialize: function () {
                this.customersCollection = new CustomersCollection();
                this.customersCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer"
            },

            selectCustomer: function (e) {
                e.preventDefault();
                var id = $(e.target).val();
                var customer = this.customersCollection.get(id).toJSON();
                if (customer.type == 'Person') {
                    this.$el.find('#company').val(customer.company.name);
                } else {
                    this.$el.find('#company').val(customer.name);
                }
                this.$el.find('#email').val(customer.email);
                this.$el.find('#phone').val(customer.phones.phone);
                this.$el.find('#mobile').val(customer.phones.mobile);
                this.$el.find('#street').val(customer.address.street);
                this.$el.find('#city').val(customer.address.city);
                this.$el.find('#state').val(customer.address.state);
                this.$el.find('#zip').val(customer.address.zip);
                this.$el.find('#country').val(customer.address.country);
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

                var opportunityModel = new OpportunityModel();

                var name = $.trim($("#name").val());

                var expectedRevenueValue = $.trim($("#expectedRevenueValue").val());
                var expectedRevenueProgress = $.trim($("#expectedRevenueProgress").val());
                var expectedRevenue;
                if (expectedRevenueValue || expectedRevenueProgress) {
                    expectedRevenue = {
                        value: expectedRevenueValue,
                        currency: '$',
                        progress: expectedRevenueProgress
                    };
                }

                var customerId = this.$("#customer option:selected").val();
                var customer = common.toObject(customerId, this.customersCollection);

                var email = $.trim($("#email").val());


                var salesPersonId = this.$("#salesPerson option:selected").val();
                var salesPerson = common.toObject(salesPersonId, this.employeesCollection);

                var salesTeamId = this.$("#salesTeam option:selected").val();
                var salesTeam = common.toObject(salesTeamId, this.departmentsCollection);

                var nextActionSt = $.trim($("#nextActionDate").val());
                var nextActionDate = $.trim($("#nextActionDescription").val());
                //var nextActionDate = "";
                //if (nextActionSt) {
                //    nextActionDate = new Date(Date.parse(nextActionSt)).toISOString();
                //}
                var nextAction = {
                    date: nextActionDate,
                    desc: nextActionDescription
                };

                var expectedClosing = $.trim($("#expectedClosing").val());
                //var expectedClosing = "";
                //if (expectedClosingSt) {
                //    expectedClosing = new Date(Date.parse(expectedClosingSt)).toISOString();
                //}

                var priority = $("#priority").val();

                var company = $.trim($("#company").val());

                var internalNotes = $.trim($("#internalNotes").val());

                var address = {};
                $("p").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = el.val();
                });

                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var contactName = {
                    first: first,
                    last: last
                };

                var func = $.trim($("#func").val());

                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var fax = $.trim($("#fax").val());
                var phones = {
                    phone: phone,
                    mobile: mobile,
                    fax: fax,
                };

                var active = ($("#active").is(":checked")) ? true : false;

                var optout = ($("#optout").is(":checked")) ? true : false;

                var reffered = $.trim($("#reffered").val());

                opportunityModel.save({
                    name: name,
                    expectedRevenue: expectedRevenue,
                    customer: customer,
                    email: email,
                    salesPerson: salesPerson,
                    salesTeam: salesTeam,
                    nextAction: nextAction,
                    expectedClosing: expectedClosing,
                    priority: priority,
                    internalNotes: internalNotes,
                    company: company,
                    address: address,
                    contactName: contactName,
                    func: func,
                    phones: phones,
                    active: active,
                    optout: optout,
                    reffered: reffered
                },
                {
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        Backbone.history.navigate("home/content-Opportunities", { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                this.$el.html(this.template({ customersCollection: this.customersCollection, employeesCollection: this.employeesCollection, departmentsCollection: this.departmentsCollection, priorityCollection: this.priorityCollection }));
                $('#nextActionDate').datepicker({ dateFormat: "d M, yy" });
                $('#expectedClosing').datepicker({ dateFormat: "d M, yy" });
                return this;
            }

        });

        return CreateView;
    });