define([
    "text!templates/Leads/EditTemplate.html",
    "text!templates/Leads/editSelectTemplate.html",
    "custom",
    'common',
    'dataService'
],
    function (EditTemplate, editSelectTemplate, Custom, common, dataService) {

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
                var mid = 39;

                var name = $.trim($("#name").val());

                var company = $("#company").val();

                var idCustomer = $("#customerDd option:selected").val();
                idCustomer = idCustomer ? idCustomer : null;
                var address = {};
                $("p").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = el.val();
                });

                var salesPersonId = $("#salesPerson option:selected").val();
                salesPersonId = salesPersonId ? salesPersonId : null;
                var salesTeamId = $("#salesTeam option:selected").val();
                salesTeamId = salesTeamId ? salesTeamId : null;
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
                    fax: fax
                };

                var workflow = $("#workflowDd option:selected").data('id');
                workflow = workflow ? workflow : null;
                var priority = $("#priorityDd option:selected").val();

                var internalNotes = $.trim($("#internalNotes").val());

                var active;
                if ($("#active").is(":checked")) { console.log("true"); active = true; }
                else { active = false; }

                var optout;
                if ($("#optout").is(":checked")) { optout = true; }
                else { optout = false; }

                var reffered = $.trim($("#reffered").val());
                var self = this;
                this.currentModel.save({
                    name: name,
                    company: company,
                    customer: idCustomer,
                    address: address,
                    salesPerson: salesPersonId,
                    salesTeam: salesTeamId,
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
                }, {
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.navigate("home/content-Leads", { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
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
                            case "workflowNames":
                                return self.workflowNameOption(item);

                        }
                    });
                    selectList.append(options);

                    if(typeof val!="undefined")
                        selectList.val(val).trigger("change");
                });
            },
            workflowNameOption: function (item) {
                return this.currentModel.get("workflow") ?
                    $('<option/>').text(item.wName).attr('selected', 'selected') :
                    $('<option/>').text(item.wName);
            },
            workflowOption: function (item) {
                return (item && this.currentModel.get("workflow") && this.currentModel.get("workflow") === item._Id) ?
                    $('<option/>').val(item.status).text(item.name).attr('selected', 'selected').attr('data-id', item._id) :
                    $('<option/>').val(item.status).text(item.name).attr('data-id', item._id);
            },
            customerOption: function (item) {
                return (item && this.currentModel.get("customer") && this.currentModel.get("customer").id === item._id) ?
                    $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                    $('<option/>').val(item._id).text(item.name);
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
				common.populateCustomers(App.ID.customerDd, "/Customer",this.currentModel.toJSON());
                common.populateDepartments(App.ID.salesTeam, "/Departments",this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.salesPerson, "/Employees",this.currentModel.toJSON());
                common.populatePriority(App.ID.priorityDd, "/Priority",this.currentModel.toJSON());
                common.populateWorkflows("Lead", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows",this.currentModel.toJSON());
                this.delegateEvents(this.events);

                return this;
           }

        });

        return EditView;
    });
