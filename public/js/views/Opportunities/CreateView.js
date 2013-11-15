define([
    "jqueryui",
    "text!templates/Opportunities/CreateTemplate.html",
    "text!templates/Opportunities/selectTemplate.html",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
     "collections/Workflows/WorkflowsCollection",
    "collections/Priority/TaskPriority",
    "models/OpportunityModel",
    "common",
    "custom"
],
    function (jqueryui, CreateTemplate, selectTemplate, CustomersCollection, EmployeesCollection, DepartmentsCollection, WorkflowsCollection, PriorityCollection, OpportunityModel, common, Custom) {
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(CreateTemplate),

            initialize: function () {
                this.workflowsCollection = new WorkflowsCollection({ id: 'Opportunity' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.customersCollection = new CustomersCollection();
                this.customersCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.render = _.after(4, this.render);
            },

            events: {
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows"
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
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
                    date: nextActionSt,
                    desc: nextActionDate
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
                
                var workflow = {
                    wName: this.$("#workflowNames option:selected").text(),
                    name: this.$("#workflow option:selected").text(),
                    status: this.$("#workflow option:selected").val(),
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
                    workflow: workflow,
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
                var workflowNames = [];
                this.workflowsCollection.models.forEach(function (option) {
                    workflowNames.push(option.get('name'));
                });
                this.$el.html(this.template({
                    customersCollection: this.customersCollection,
                    employeesCollection: this.employeesCollection,
                    departmentsCollection: this.departmentsCollection,
                    priorityCollection: this.priorityCollection,
                    workflowNames: workflowNames
                }));
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(this.workflowsCollection.models[0].get('value')) }));
                $('#nextActionDate').datepicker({ dateFormat: "d M, yy" });
                $('#expectedClosing').datepicker({ dateFormat: "d M, yy" });
                return this;
            }

        });

        return CreateView;
    });