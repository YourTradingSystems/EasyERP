define([
    "text!templates/Leads/EditTemplate.html",
    "custom",
    'common',
    'dataService'
],
    function (EditTemplate, Custom, common, dataService) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",
                "change #workflowNames": "changeWorkflows",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
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
                    //$("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(value) }));
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

                var name = $.trim(this.$el.find("#name").val());

                var company = $.trim(this.$el.find("#company").val());

                var idCustomer = $("#customerDd option:selected").val();
                idCustomer = idCustomer ? idCustomer : null;
                var address = {};
                $("p").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var salesPersonId = this.$("#salesPerson option:selected").val();
                salesPersonId = salesPersonId ? salesPersonId : null;
                var salesTeamId = this.$("#salesTeam option:selected").val();
                salesTeamId = salesTeamId ? salesTeamId : null;
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
                    campaign: this.$el.find('#campaignDd option:selected').val(),
                    source: this.$el.find('#sourceDd option:selected').val(),
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
                        Backbone.history.navigate("easyErp/Leads", { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
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
                                $('.edit-leads-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-leads-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },
			showNewSelect:function(e){
				var s="<ul class='newSelectList'>";
				$(e.target).parent().find("select option").each(function(){
					s+="<li>"+$(this).text()+"</li>";
				});
				 s+="</ul>";
				$(e.target).parent().append(s);
				
			},
			hideNewSelect:function(e){
				$(".newSelectList").remove();;
			},
			showNewSelect:function(e){
				this.hideNewSelect();
				var s="<ul class='newSelectList'>";
				$(e.target).parent().find("select option").each(function(){
					s+="<li class="+$(this).text().toLowerCase()+">"+$(this).text()+"</li>";
				});
				 s+="</ul>";
				$(e.target).parent().append(s);
				return false;
				
			},
			chooseOption:function(e){
				var k = $(e.target).parent().find("li").index($(e.target));
				$(e.target).parents("dd").find("select option:selected").removeAttr("selected");
				$(e.target).parents("dd").find("select option").eq(k).attr("selected","selected");
				$(e.target).parents("dd").find(".current-selected").text($(e.target).text());
			},

			styleSelect:function(id){
				var text = $(id).find("option:selected").length==0?$(id).find("option").eq(0).text():$(id).find("option:selected").text();
				$(id).parent().append("<a class='current-selected' href='javascript:;'>"+text+"</a>");
				$(id).hide();
			},

            render: function () {
                var formString = this.template(this.currentModel.toJSON());
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-leads-dialog",
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
                common.populateCustomers(App.ID.customerDd, "/Customer", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.customerDd);});
                common.populateDepartments(App.ID.salesTeam, "/Departments", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.salesTeam);});
                common.populateEmployeesDd(App.ID.salesPerson, "/getPersonsForDd", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.salesPerson);});
                common.populatePriority(App.ID.priorityDd, "/Priority", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.priorityDd);});
                common.populateWorkflows("Lead", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.workflowDd);self.styleSelect(App.ID.workflowNamesDd);});
				this.styleSelect("#sourceDd");
				this.styleSelect("#campaignDd");
                this.delegateEvents(this.events);
                $('#campaignDd').val(this.currentModel.get('campaign'));
                $('#sourceDd').val(this.currentModel.get('source'));
                return this;
            }

        });

        return EditView;
    });
