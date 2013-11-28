define([
    "text!templates/Opportunities/EditTemplate.html",
    "text!templates/Opportunities/editSelectTemplate.html",
    "common",
    "custom",
    'dataService'
],
    function (EditTemplate, editSelectTemplate, common, Custom, dataService) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                this.opportunitiesCollection = options.collection;
                this.currentModel = this.opportunitiesCollection.getElement();
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

            hideDialog: function () {
                $(".edit-opportunity-dialog").remove();
            },
            populateDropDown: function (type, selectId, url, val) {
                var selectList = $(selectId);
                var self = this;
                selectList.append($("<option/>").val('').text('Select...'));
                dataService.getData(url, { mid: 39 }, function (response) {
                    var options = $.map(response.data, function (item) {
                        switch (type) {
                            case "customers":
                                return self.customerOption(item);
                            case "salesPersons":
                                return self.salesPersonsOption(item);
                            case "salesTeam":
                                return self.salesTeamOption(item);
                            case "priority":
                                return self.priorityOption(item);
                            case "workflows":
                                return self.workflowOption(item);
                        }
                    });
                    selectList.append(options);

                    if (typeof val != "undefined")
                        selectList.val(val).trigger("change");
                });
            },
            workflowOption: function (item) {
                return (item && this.currentModel.get("workflow") && this.currentModel.get("workflow")._id === item._id) ?
                    $('<option/>').val(item.status).text(item.name).attr('selected', 'selected').attr('data-id', item._id) :
                    $('<option/>').val(item.status).text(item.name).attr('data-id', item._id);
            },
            customerOption: function (item) {
                return (item && this.currentModel.get("customer") && this.currentModel.get("customer").id === item._id) ?
                    $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
            },
            salesPersonsOption: function (item) {
                return (item && this.currentModel.get("salesPerson") && this.currentModel.get("salesPerson").id === item._id) ?
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
            },
            salesTeamOption: function (item) {
                return (item && this.currentModel.get("salesTeam") && this.currentModel.get("salesTeam")._id === item._id) ?
                    $('<option/>').val(item._id).text(item.departmentName).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.departmentName);
            },
            priorityOption: function (item) {
                return this.currentModel.id === item._id ?
                    $('<option/>').val(item._id).text(item.priority).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.priority);
            },

            render: function () {
                var formString = this.template({ model: this.currentModel.toJSON() });
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-opportunity-dialog",
                    width: 900,
                    height: 650,
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });
                $('#nextActionDate').datepicker();
                common.populateCustomers(App.ID.customerDd, App.URL.customers, this.currentModel);
                this.populateDropDown("salesPersons", App.ID.salesPersonDd, App.URL.salesPersons);
                this.populateDropDown("salesTeam", App.ID.salesTeamDd, App.URL.salesTeam);
                this.populateDropDown("priority", App.ID.priorityDd, App.URL.priorities);
                this.populateDropDown("workflows", App.ID.workflowNamesDd, '/Workflows?id=Opportunity');
                this.delegateEvents(this.events);
                return this;
            }

        });
        return EditView;
    });