define([
    "text!templates/Opportunities/EditTemplate.html",
    "text!templates/Opportunities/editSelectTemplate.html",
    "collections/Opportunities/OpportunitiesCollection",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Priority/TaskPriority",
    "collections/Workflows/WorkflowsCollection",
    "common",
    "custom"
],
    function (EditTemplate, editSelectTemplate, OpportunitiesCollection, CustomersCollection, EmployeesCollection, DepartmentsCollection, PriorityCollection, WorkflowsCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",

            initialize: function (options) {
                this.customersCollection = new CustomersCollection();
                this.customersCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.workflowsCollection = new WorkflowsCollection({ id: 'Opportunity' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.opportunitiesCollection = options.collection;
                this.opportunitiesCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click .breadcrumb a, #lost, #won": "changeWorkflow",
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows"
            },
            
            changeWorkflows: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.opportunitiesCollection.models[itemIndex].toJSON();
                    var name = this.$("#workflowNames option:selected").val();
                    var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                    $("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(value) }));
                }
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
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
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

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
                    var _customer = common.toObject(customerId, this.customersCollection);
                    var customer = {};
                    if (_customer) {
                        customer.id = _customer._id;
                        customer.name = _customer.name;
                    } else {
                        customer = currentModel.defaults.customer;
                    }

                    var email = $.trim($("#email").val());

                    var salesPersonId = this.$("#salesPerson option:selected").val();
                    var _salesPerson = common.toObject(salesPersonId, this.employeesCollection);
                    var salesPerson = {};
                    if (_salesPerson) {
                        salesPerson.id = _salesPerson._id;
                        salesPerson.name = _salesPerson.name.first + ' ' + _salesPerson.name.last;
                    } else {
                        salesPerson = currentModel.defaults.salesPerson;
                    }

                    var salesTeamId = this.$("#salesTeam option:selected").val();
                    var _salesTeam = common.toObject(salesTeamId, this.departmentsCollection);
                    var salesTeam = {};
                    if (_salesTeam) {
                        salesTeam.id = _salesTeam._id;
                        salesTeam.name = _salesTeam.departmentName;
                    } else {
                        salesTeam = currentModel.defaults.salesTeam;
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

                    currentModel.set({
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
                        workflow: workflow,
                        active: active,
                        optout: optout,
                        reffered: reffered
                    });
                    currentModel.save({}, {
                        headers: {
                            mid: mid
                        }
                    });
                    Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
                }
            },

           /* changeWorkflow: function (e) {
                var mid = 39;
                var name = '', status = '';
                var length = this.workflowsCollection.models.length;
                var workflow = {};
                if ($(e.target).attr("id") == "won") {
                    workflow = this.workflowsCollection.models[length - 2];
                }
                else {
                    workflow = this.workflowsCollection.models[length - 1];
                }
                name = workflow.get('name');
                status = workflow.get('status');
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: name,
                        status: status
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }
                });
            },*/

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                }
                else {
                    var currentModel = this.opportunitiesCollection.models[itemIndex];
                    var workflowModel = this.workflowsCollection.findWhere({ name: currentModel.toJSON().workflow.wName });
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(),
                        customersCollection: this.customersCollection,
                        employeesCollection: this.employeesCollection,
                        departmentsCollection: this.departmentsCollection,
                        priorityCollection: this.priorityCollection,
                        workflowsCollection: this.workflowsCollection
                    }));
                    $("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(workflowModel.toJSON().value) }));
                    var nextAction = currentModel.get('nextAction').date;
                    //if (nextAction) {
                    //    nextAction['date'] = this.ISODateToDate(nextAction);
                    //    currentModel.set({ nextAction: nextAction }, { silent: true });
                    //}
                    currentModel.on('change', this.render, this);
                }
                $('#nextActionDate').datepicker();
                return this;
            }

        });
        return EditView;
    });