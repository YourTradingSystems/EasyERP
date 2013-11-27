define([
    "text!templates/Leads/EditTemplate.html",
    "text!templates/Leads/editSelectTemplate.html",
    "custom",
    'common',
    'dataService'
],
    function (EditTemplate, editSelectTemplate, Custom, common,dataService) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "saveItem");
                this.collection = options.collection;
                this.currentModel = this.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler'
            },
            keydownHandler: function(e){
                switch (e.which){
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
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
            hideDialog: function () {
                $(".edit-leads-dialog").remove();
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

            changeWorkflows: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.contentCollection.models[itemIndex].toJSON();
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

            saveItem: function () {

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var mid = 39;

                    var name = $.trim($("#name").val());

                    var company = $(this.el).find("#company").val();

                    var idCustomer = $(this.el).find("#customer option:selected").val();
                    var _customer = common.toObject(idCustomer, this.customersCollection);
                    var customer = {};
                    if (_customer) {
                        customer.id = _customer._id;
                        customer.name = _customer.name;
                    } else {
                        customer = currentModel.defaults.customer;
                    }

                    var address = {};
                    $("p").find(".address").each(function () {
                        var el = $(this);
                        address[el.attr("name")] = el.val();
                    });

                    var salesPersonId = this.$("#salesPerson option:selected").val();
                    var objSalesPerson = common.toObject(salesPersonId, this.employeesCollection);
                    var salesPerson = {};
                    if (objSalesPerson) {
                        salesPerson.id = salesPersonId;
                        salesPerson.name = objSalesPerson.name.first + " " + objSalesPerson.name.last;
                    } else {
                        salesPerson = currentModel.defaults.salesPerson;
                    }

                    var salesTeamId = this.$("#salesTeam option:selected").val();
                    var objSalesTeam = common.toObject(salesTeamId, this.departmentsCollection);
                    var salesTeam = {};
                    if (objSalesTeam) {
                        salesTeam.id = salesTeamId;
                        salesTeam.name = objSalesTeam.departmentName;
                    } else {
                        salesTeam = currentModel.defaults.salesTeam;
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

                    var priority = $("#priority").val();

                    var internalNotes = $.trim($("#internalNotes").val());

                    var active;
                    if ($("#active").is(":checked")) { console.log("true"); active = true; }
                    else { active = false; }

                    var optout;
                    if ($("#optout").is(":checked")) { optout = true; }
                    else { optout = false; }

                    var reffered = $.trim($("#reffered").val());

                    currentModel.set({
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
                        workflow: workflow,
                        fax: fax,
                        priority: priority,
                        internalNotes: internalNotes,
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

            populateDropDown: function (type, selectId, url, val) {
                var selectList = $(selectId);
                var self = this;
                var workflowNames = [];
                this.workflows = [];
                var my_wId;
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
                            case "workflows": {

                                break;
                            }
                        }
                    });
                    selectList.append(options);

                    if(typeof val!="undefined")
                        selectList.val(val).trigger("change");
                });
            },
            workflowOption: function (item) {
                return (this.currentModel.get("workflow") && this.currentModel.get("workflow").wId === item.wId) ?
                    $('<option/>').val(item.wId).text(item.wName).attr('selected', 'selected') :
                    $('<option/>').val(item.wId).text(item.wName);
            },
            customerOption: function (item) {
                return (this.currentModel.get("customer") && this.currentModel.get("customer").id === item._id) ?
                    $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name);
            },
            salesPersonsOption: function (item) {
                return (this.currentModel.get("salesPerson") && this.currentModel.get("salesPerson").id === item._id) ?
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
            },
            salesTeamOption: function (item) {
                return (this.currentModel.get("salesTeam") && this.currentModel.get("salesTeam")._id === item._id) ?
                    $('<option/>').val(item._id).text(item.departmentName).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.departmentName);
            },
            priorityOption: function (item) {
                return this.currentModel.id === item._id ?
                    $('<option/>').val(item._id).text(item.priority).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.priority);
            },

            render: function () {
                //var workflowModel = this.workflowsCollection.findWhere({ name: this.currentModel.workflow.wName }).toJSON();
                //$("#selectWorkflow").html(_.template(editSelectTemplate, { model: this.currentModel, workflows: this.getWorkflowValue(workflowModel.value) }));
                var formString = this.template(this.currentModel.toJSON());
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-leads-dialog",
                    width: 900,
                    height: 650,
                    buttons:{
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text:"Cancel",
                            class:"btn",
                            click:self.hideDialog
                        }
                    }
                });
                this.populateDropDown("customers", App.ID.customerDd, App.URL.customers);
                this.populateDropDown("salesPersons", App.ID.salesPersonDd, App.URL.salesPersons);
                this.populateDropDown("salesTeam", App.ID.salesTeamDd, App.URL.salesTeam);
                this.populateDropDown("priority", App.ID.priorityDd, App.URL.priorities);
                //this.populateDropDown("workflows", App.ID.workflowDd, App.URL.workflows);
                this.delegateEvents(this.events);

                return this;
           }

        });

        return EditView;
    });