define([
    "text!templates/Opportunities/EditTemplate.html",
    "text!templates/Opportunities/editSelectTemplate.html",
    "common",
    "custom"
],
    function (EditTemplate, editSelectTemplate, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.opportunitiesCollection = options.collection;
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click .breadcrumb a, #lost, #won": "changeWorkflow",
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler'
            },
            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
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
                event.preventDefault();
                var self = this;

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

                    var customerId = this.$("#customerDd option:selected").val();
                    customerId = customerId ? customerId : null;

                    var email = $.trim($("#email").val());

                    var salesPersonId = this.$("#salesPersonDd option:selected").val();
                    salesPersonId = salesPersonId ? salesPersonId : null;

                    var salesTeamId = this.$("#salesTeamDd option:selected").val();
                    salesTeamId = salesTeamId ? salesTeamId : null;

                    var nextActionDate = $.trim(this.$el.find("#nextActionDate").val());
                    var nextActionDescription = $.trim(this.$el.find("#nextActionDescription").val());
                    /*var nextActionDate = "";
                    if (nextActionSt) {
                        nextActionDate = $.trim($("#nextActionDate").val());
                    };*/
                    var nextAction = {
                        date: nextActionDate,
                        desc: nextActionDescription
                    };

                    var expectedClosing = $.trim(this.$el.find("#expectedClosing").val());
                    //var expectedClosing = "";
                    /*if (expectedClosingSt){
                        expectedClosing = $.trim($("#expectedClosing").val());
                    };*/

                    var priority = $(App.ID.priorityDd).val();

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
                        fax: fax
                    };

                    var workflow = this.$("#workflowDd option:selected").val();
                    workflow = workflow ? workflow : null;

                    var active = ($("#active").is(":checked")) ? true : false;

                    var optout = ($("#optout").is(":checked")) ? true : false;

                    var reffered = $.trim($("#reffered").val());
                    var self = this;
                    this.currentModel.set({
                        name: name,
                        expectedRevenue: expectedRevenue,
                        customer: customerId,
                        email: email,
                        salesPerson: salesPersonId,
                        salesTeam: salesTeamId,
                        nextAction: nextAction,
                        expectedClosing: expectedClosing,
                        priority: priority,
                        internalNotes: internalNotes,
                        address: address,
                        contactName: contactName,
                        func: func,
                        phones: phones,
                        workflow: workflow,
                        active: active,
                        optout: optout,
                        reffered: reffered
                    });
                    this.currentModel.save({}, {
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/Opportunities", { trigger: true });
                        },
                        error: function () {
                            self.hideDialog();
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
            },

            hideDialog: function () {
                $(".edit-opportunity-dialog").remove();
            },

            deleteItem: function(event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                    var answer = confirm("Realy DELETE items ?!");
                    if (answer == true) {
                        this.currentModel.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                $('.edit-opportunity-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-opportunity-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },
            render: function () {
                var formString = this.template({ model: this.currentModel.toJSON() });
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-opportunity-dialog",
                    width: 900,
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
                        },
                        delete:{
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                $('#nextActionDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                $('#expectedClosing').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                var model = this.currentModel.toJSON();
                common.populateCustomers(App.ID.customerDd, App.URL.customers, model);
                common.populateEmployeesDd(App.ID.salesPersonDd, App.URL.salesPersons, model);
                common.populateDepartments(App.ID.salesTeamDd, App.URL.salesTeam, model);
                common.populatePriority(App.ID.priorityDd, App.URL.priorities, model);
                common.populateWorkflows('Opportunity', '#workflowDd', App.ID.workflowNamesDd, '/Workflows', model);
                this.delegateEvents(this.events);
                return this;
            }

        });
        return EditView;
    });
