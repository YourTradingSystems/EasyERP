define([
    "text!templates/Leads/CreateTemplate.html",
    "text!templates/Leads/selectTemplate.html",
    "collections/Leads/LeadsCollection",
    "collections/Companies/CompaniesCollection",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "collections/Priority/TaskPriority",
    "models/LeadModel",
    "common"
],
    function (CreateTemplate, selectTemplate, LeadsCollection, CompaniesCollection, CustomersCollection, EmployeesCollection, DepartmentsCollection, WorkflowsCollection, PriorityCollection, LeadModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(CreateTemplate),

            initialize: function(options) {
                this.workflowsCollection = new WorkflowsCollection({ id: 'Lead' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
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
                this.render = _.after(6, this.render);
            },

            close: function() {
                this._modelBinder.unbind();
            },

            events: {
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",
            },

            selectCustomer: function(e) {
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

            switchTab: function(e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem: function() {

                var mid = 39;

                var model = new LeadModel();

                var name = $.trim($("#name").val());

                var company = this.$("#company").val();

                var idCustomer = $(this.el).find("#customer option:selected").val();
                var customer = common.toObject(idCustomer, this.customersDdCollection);

                var address = {};
                $("p").find(".address").each(function() {
                    var el = $(this);
                    address[el.attr("name")] = el.val();
                });

                var salesPersonId = this.$("#salesPerson option:selected").val();
                var salesPerson = common.toObject(salesPersonId, this.employeesCollection);

                var salesTeamId = this.$("#salesTeam option:selected").val();
                var salesTeam = common.toObject(salesTeamId, this.departmentsCollection);

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
                var fax = $.trim($("#fax").val());
                var phones = {
                    phone: phone,
                    mobile: mobile,
                    fax: fax,
                };

                var priority = $("#priority").val();

                var internalNotes = $.trim($("#internalNotes").val());

                var active = ($("#active").is(":checked")) ? true : false;

                var optout = ($("#optout").is(":checked")) ? true : false;

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
                        },
                        success: function(model) {
                            Backbone.history.navigate("home/content-Leads", { trigger: true });
                        },
                        error: function(model, xhr, options) {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });

                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });

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

            render: function () {
                var workflowNames = [];
                this.workflowsCollection.models.forEach(function (option) {
                    workflowNames.push(option.get('name'));
                });
                
                //var workflows = this.getWorkflowsValue()[0];
                console.log(workflowNames);
                this.$el.html(this.template({
                    companiesCollection: this.companiesCollection,
                    customersCollection: this.customersCollection,
                    employeesCollection: this.employeesCollection,
                    departmentsCollection: this.departmentsCollection,
                    priorityCollection: this.priorityCollection,
                    workflowNames: workflowNames
                }));
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(this.workflowsCollection.models[0].get('value')) }));
                return this;
            }

        });
        return CreateView;
    });