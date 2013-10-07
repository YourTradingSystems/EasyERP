define([
    "jqueryui",
    "text!templates/Opportunities/CreateTemplate.html",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Priority/TaskPriority",
    "models/OpportunityModel",
    "custom"
],
    function (jqueryui, CreateTemplate, CustomersCollection, EmployeesCollection, DepartmentsCollection, PriorityCollection, OpportunityModel, Custom) {
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

                var opportunityModel = new OpportunityModel();

                var name = $.trim($("#name").val());

                var expectedRevenueValue = $.trim($("#expectedRevenueValue").val());
                var expectedRevenueProgress = $.trim($("#expectedRevenueProgress").val());
                if (expectedRevenueValue || expectedRevenueProgress) {
                    var expectedRevenue = {
                        value: expectedRevenueValue,
                        currency: '$',
                        progress: expectedRevenueProgress
                    };
                }

                var customerId = this.$("#customer option:selected").val();
                var objCustomer = this.customersCollection.get(customerId);
                var customer = {};
                if (objCustomer) {
                    customer.id = customerId;
                    customer.name = objCustomer.get('name').first + " " + objCustomer.get('name').last;
                }

                var email = $.trim($("#email").val());
                var phone = $.trim($("#phone").val());

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

                var nextActionSt = $.trim($("#nextActionDate").val());
                var nextActionDescription = $.trim($("#nextActionDescription").val());
                var nextActionDate = "";
                if (nextActionSt) {
                    nextActionDate = new Date(Date.parse(nextActionSt)).toISOString();
                }
                var nextAction = {
                    date: nextActionDate,
                    desc: nextActionDescription
                };

                var expectedClosingSt = $.trim($("#expectedClosing").val());
                var expectedClosing = "";
                if (expectedClosingSt) {
                    expectedClosing = new Date(Date.parse(expectedClosingSt)).toISOString();
                }

                var priority = $("#priority").val();

                var internalNotes = $.trim($("#internalNotes").val());

                opportunityModel.save({
                    name: name,
                    expectedRevenue: expectedRevenue,
                    customer: customer,
                    email: email,
                    phone: phone,
                    salesPerson: salesPerson,
                    salesTeam: salesTeam,
                    nextAction: nextAction,
                    expectedClosing: expectedClosing,
                    priority: priority,
                    internalNotes: internalNotes
                },
                {
                    headers: {
                        mid: mid
                    },
                });



                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
            },

            render: function () {
                this.$el.html(this.template({ customersCollection: this.customersCollection, employeesCollection: this.employeesCollection, departmentsCollection: this.departmentsCollection, priorityCollection: this.priorityCollection }));
                return this;
            }

        });

        return CreateView;
    });