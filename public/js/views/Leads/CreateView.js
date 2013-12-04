define([
    "text!templates/Leads/CreateTemplate.html",
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
    function (CreateTemplate, LeadsCollection, CompaniesCollection, CustomersCollection, EmployeesCollection, DepartmentsCollection, WorkflowsCollection, PriorityCollection, LeadModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                this.contentCollection = options.collection;
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows"
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                //$("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
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
				var self = this;
                var $company = this.$("#company");
                var mid = 39;

                var model = new LeadModel();

                var name = $.trim($("#name").val());

                var company = {
                    name: $company.val(),
                    id: $company.data('id')
                }
                var idCustomer = this.$("#customerDd option:selected").val();
                var address = {};
                $("p").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = el.val();
                });

                var salesPersonId = this.$("#salesPerson option:selected").val();

                var salesTeamId = this.$("#salesTeam option:selected").val();

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
                var workflow = this.$("#workflowsDd option:selected").data('id');


                var priority = $("#priorityDd").val();

                var internalNotes = $.trim($("#internalNotes").val());

                var active = ($("#active").is(":checked")) ? true : false;

                var optout = ($("#optout").is(":checked")) ? true : false;

                var reffered = $.trim($("#reffered").val());

                model.save({
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
                    fax: fax,
                    priority: priority,
                    internalNotes: internalNotes,
                    active: active,
                    optout: optout,
                    reffered: reffered,
                    workflow: workflow
                },
                    {
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
            hideDialog: function () {
                $(".edit-dialog").remove();
            },
            render: function () {
				var self=this;
                var formString = this.template({

				});
                this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:true,
					dialogClass:"edit-dialog",
					title: "Edit Company",
					width:"80%",
					height:690,
                    buttons: [
                        {
                            text: "Create",
                            click: function () { self.saveItem(); }
                        },

						{
							text: "Cancel",
							click: function () { self.hideDialog(); }
						}]

                });
				common.populateCustomers(App.ID.customerDd, "/Customer");
                common.populateDepartments(App.ID.salesTeam, "/Departments");
                common.populateEmployeesDd(App.ID.salesPerson, "/Employees");
                common.populatePriority(App.ID.priorityDd, "/Priority");
                common.populateWorkflows("Lead", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows");
                this.delegateEvents(this.events);

                return this;
            }

        });
        return CreateView;
    });
