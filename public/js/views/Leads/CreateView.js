define([
    "text!templates/Leads/CreateTemplate.html",
    "models/LeadsModel",
    "common"
],
    function (CreateTemplate, LeadModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(CreateTemplate),

            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new LeadModel();
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
                var name = $.trim(this.$el.find("#name").val());

                var company = {
                    name: $company.val(),
                    id: $company.data('id')
                }
                var idCustomer = this.$("#customerDd option:selected").val();
                var address = {};
                $("dd").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var salesPersonId = this.$("#salesPerson option:selected").val();
                var salesTeamId = this.$("#salesTeam option:selected").val();
                var first = $.trim(this.$el.find("#first").val());
                var last = $.trim(this.$el.find("#last").val());
                var contactName = {
                    first: first,
                    last: last
                };
                var email = $.trim(this.$el.find("#email").val());
                var func = $.trim(this.$el.find("#func").val());

                var phone = $.trim(this.$el.find("#phone").val());
                var mobile = $.trim(this.$el.find("#mobile").val());
                var fax = $.trim(this.$el.find("#fax").val());
                var phones = {
                    phone: phone,
                    mobile: mobile,
                    fax: fax
                };
                var workflow = this.$("#workflowsDd option:selected").data('id');
                var priority = $("#priorityDd").val();
                var internalNotes = $.trim(this.$el.find("#internalNotes").val());
                var active = (this.$el.find("#active").is(":checked")) ? true : false;
                var optout = (this.$el.find("#optout").is(":checked")) ? true : false;
                var reffered = $.trim(this.$el.find("#reffered").val());

                this.model.save({
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
                            Backbone.history.navigate("easyErp/Leads", { trigger: true });
                        },
                        error: function (model, xhr, options) {
                            Backbone.history.navigate("easyErp", { trigger: true });
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
