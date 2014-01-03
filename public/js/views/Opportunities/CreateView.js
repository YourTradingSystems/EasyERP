define([
    "text!templates/Opportunities/CreateTemplate.html",
    "models/OpportunitiesModel",
    "common"
],
    function (CreateTemplate, OpportunityModel, common) {
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                var model = (options && options.model) ? options.model : null;
                this.page=1;
                this.pageG=1;
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",

                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                "click .prevUserList":"prevUserList",
                "click .nextUserList":"nextUserList"
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
            changeTab:function(e){
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
            },
            addUser:function(e){
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",

                            click: function(){
                                click: self.addUserToTable("#targetUsers")
                                $( this ).dialog( "close" );
                            }

                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
                                $( this ).dialog( "close" );
                            }
                        }
                    }

                });
                $("#targetUsers").unbind().on("click","li",this.removeUsers);
                $("#sourceUsers").unbind().on("click","li",this.addUsers);
                var self = this;
                $(".nextUserList").unbind().on("click",function(e){
                    self.page+=1
                    self.nextUserList(e,self.page)
                });
                $(".prevUserList").unbind().on("click",function(e){
                    self.page-=1
                    self.prevUserList(e,self.page)
                });
            },
            addUserToTable:function(id){
                $(".groupsAndUser").show();
                $(".groupsAndUser tr").each(function(){
                    if ($(this).data("type")==id.replace("#","")){
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function(){
                    $(".groupsAndUser").append("<tr data-type='"+id.replace("#","")+"' data-id='"+ $(this).attr("id")+"'><td>"+$(this).text()+"</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length<2){
                    $(".groupsAndUser").hide();
                }
            },
            addGroup:function(e){
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",
                            click: function(){
                                self.addUserToTable("#targetGroups")
                                $( this ).dialog( "close" );
                            }
                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
                                $( this ).dialog( "close" );
                            }
                        }
                    }

                });
                $("#targetGroups").unbind().on("click","li",this.removeUsers);
                $("#sourceGroups").unbind().on("click","li",this.addUsers);
                var self = this;
                $(".nextGroupList").unbind().on("click",function(e){
                    self.pageG+=1
                    self.nextUserList(e,self.pageG)
                });
                $(".prevGroupList").unbind().on("click",function(e){
                    self.pageG-=1
                    self.prevUserList(e,self.pageG)
                });

            },
            unassign:function(e){
                var id=$(e.target).closest("tr").data("id");
                var type=$(e.target).closest("tr").data("type");
                var text=$(e.target).closest("tr").find("td").eq(0).text();
                $("#"+type).append("<option value='"+id+"'>"+text+"</option>");
                $(e.target).closest("tr").remove();
                if ($(".groupsAndUser").find("tr").length==1){
                    $(".groupsAndUser").hide();
                }

            },
            nextUserList:function(e,page){
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,page);
            },
            prevUserList:function(e,page){
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,page);
            },
            addUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));

            },
            removeUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
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
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
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
                
                var nextAction = $.trim(this.$el.find("#nextActionDate").val());
                var nextActionDesc = $.trim(this.$el.find("#nextActionDescription").val());
                var nextAction = {
                    date: nextAction,
                    desc: nextActionDesc
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
                    fax: fax
                };

                var workflow = this.$("#workflowDd option:selected").data('id');

                var active = ($("#active").is(":checked")) ? true : false;

                var optout = ($("#optout").is(":checked")) ? true : false;

                var reffered = $.trim($("#reffered").val());
                var self = this;

                var usersId=[];
                var groupsId=[];
                $(".groupsAndUser tr").each(function(){
                    if ($(this).data("type")=="targetUsers"){
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type")=="targetGroups"){
                        groupsId.push($(this).data("id"));
                    }

                });
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
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
                    reffered: reffered,
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                },
                {
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Opportunities", { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("easyErp", { trigger: true });
                    }
                });
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "50%",
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
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
                common.populateUsers("#allUsers", "/Users",null,null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/Departments",null,this.pageG);


                $('#nextActionDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                $('#expectedClosing').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                common.populateCustomers(App.ID.customerDd, App.URL.customers,this.model);
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
