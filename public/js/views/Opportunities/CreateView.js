define([
    "text!templates/Opportunities/CreateTemplate.html",
    "models/OpportunityModel",
    "common"
],
    function (CreateTemplate, OpportunityModel, common) {
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(CreateTemplate),

            initialize: function () {
                _.bindAll(this, "saveItem");
                this.render();
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
            
            hideDialog: function () {
                $(".edit-dialog").remove();
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

                var customerId = this.$("#customerDd option:selected").val();
                var email = $.trim($("#email").val());


                var salesPersonId = this.$("#salesPersonDd option:selected").val();
                
                var salesTeamId = this.$("#salesTeamDd option:selected").val();
                
                var nextActionSt = $.trim($("#nextActionDate").val());
                var nextActionDate = $.trim($("#nextActionDescription").val());
                var nextAction = {
                    date: nextActionSt,
                    desc: nextActionDate
                };

                var expectedClosing = $.trim($("#expectedClosing").val());
                
                var priority = $("#priorityDd").val();

                var company = $.trim($("#company").val());

                var internalNotes = $.trim($("#internalNotes").val());

                var address = {};
                $("dd").find(".address").each(function () {
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

                var workflow = this.$("#workflowDd option:selected").data('id');

                var active = ($("#active").is(":checked")) ? true : false;

                var optout = ($("#optout").is(":checked")) ? true : false;

                var reffered = $.trim($("#reffered").val());
                var self = this;
                opportunityModel.save({
                    name: name,
                    expectedRevenue: expectedRevenue,
                    customer: customerId,
                    email: email,
                    salesPerson: salesPersonId,
                    salesTeam: salesTeamId,
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
                        self.hideDialog();
                        Backbone.history.navigate("home/content-Opportunities", { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "50%",
                    height: 513,
                    title: "Create Opportunity",
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    }
                });
                $('#nextActionDate').datepicker({ dateFormat: "d M, yy" });
                $('#expectedClosing').datepicker({ dateFormat: "d M, yy" });
                common.populateCustomers(App.ID.customerDd, App.URL.customers);
                common.populateEmployeesDd(App.ID.salesPersonDd, App.URL.salesPersons);
                common.populateDepartments(App.ID.salesTeamDd, App.URL.salesTeam);
                common.populatePriority(App.ID.priorityDd, App.URL.priorities);
                common.populateWorkflows('Opportunity', '#workflowDd', App.ID.workflowNamesDd, '/Workflows');
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
