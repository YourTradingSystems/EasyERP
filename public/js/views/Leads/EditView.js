define([
    "text!templates/Leads/EditTemplate.html",
    "custom",
    'common',
    'dataService',
	"populate"
],
    function (EditTemplate, Custom, common, dataService, populate) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.page=1;
                this.pageG=1;
				this.responseObj = {};
                this.render();
            },

            events: {
                "click #convertToOpportunity": "openDialog",
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers':'addUsers',
                'click #removeUsers':'removeUsers',
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",

            },
            openDialog: function (e) {
				e.preventDefault();
                $("#convert-dialog-form").dialog("open");
            },

            notHide: function () {
				return false;
            },

			nextSelect:function(e){
				this.showNewSelect(e,false,true);
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false);
			},
            changeTab:function(e){
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n= $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            addUser:function(){
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",

                            click: function(){
                                self.addUserToTable("#targetUsers");
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
				this.updateAssigneesPagination($("#sourceUsers").closest(".left"));
				this.updateAssigneesPagination($("#targetUsers").closest(".left"));
                $("#targetUsers").on("click", "li", {self:this},this.removeUsers);
                $("#sourceUsers").on("click", "li", {self:this},this.addUsers);
                $(document).on("click", ".nextUserList",{self:this}, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevUserList",{self:this}, function (e) {
                    self.prevUserList(e);
                });
            },

            addGroup:function(){
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",
                            click: function(){
                                self.addUserToTable("#targetGroups");
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
				this.updateAssigneesPagination($("#sourceGroups").closest(".left"));
				this.updateAssigneesPagination($("#targetGroups").closest(".left"));
                $("#targetGroups").on("click", "li", {self:this},this.removeUsers);
                $("#sourceGroups").on("click", "li", {self:this},this.addUsers);
                $(document).on("click", ".nextUserList",{self:this}, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevUserList",{self:this}, function (e) {
                    self.prevUserList(e);
                });
            },

            nextUserList: function (e, page) {
				$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))+1);
				e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },

            prevUserList: function (e, page) {
				$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))-1);
				e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },
            addUsers: function (e) {
                e.preventDefault();
				$(e.target).parents("ul").find("li:not(:visible)").eq(0).show();
				var div =$(e.target).parents(".left");
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));
				e.data.self.updateAssigneesPagination(div);
				div =$(e.target).parents(".left");
				e.data.self.updateAssigneesPagination(div);

            },

            removeUsers: function (e) {
                e.preventDefault();
				var div =$(e.target).parents(".left");
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
				e.data.self.updateAssigneesPagination(div);
				div =$(e.target).parents(".left");
				e.data.self.updateAssigneesPagination(div);
            },
			updateAssigneesPagination:function(el){
				var pag = el.find(".userPagination .text");
				el.find(".userPagination .nextUserList").remove();
				el.find(".userPagination .prevUserList").remove();
				el.find(".userPagination .nextGroupList").remove();
				el.find(".userPagination .prevGroupList").remove();

				var list = el.find("ul");
				var count = list.find("li").length;
				var s ="";
				var page  = parseInt(list.attr("data-page"));
				if (page>1){
					el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
				}
				if (count===0){
					s+="0-0 of 0";
				}else{
					if ((page)*20-1<count){
						s+=((page-1)*20+1)+"-"+((page)*20)+" of "+count;
					}else{
						s+=((page-1)*20+1)+"-"+(count)+" of "+count;
					}
				}
				
				if (page<count/20){
					el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
				}
				el.find("ul li").hide();
				for (var i=(page-1)*20;i<20*page;i++){
					el.find("ul li").eq(i).show();
				}
 
				pag.text(s);
			},

            unassign: function(e){
                var holder = $(e.target);
                var id = holder.closest("tr").data("id");
                var type = holder.closest("tr").data("type");
                var text = holder.closest("tr").find("td").eq(0).text();
                $("#"+type).append("<option value='"+id+"'>"+text+"</option>");
                holder.closest("tr").remove();
                var groupsAndUser = $(".groupsAndUser");
                if (groupsAndUser.find("tr").length==1){
                    groupsAndUser.hide();
                }

            },

            chooseUser:function(e){
                $(e.target).toggleClass("choosen");
            },

            addUserToTable:function(id){
                var groupsAndUser_holder = $(".groupsAndUser");
                var groupsAndUserHr_holder = $(".groupsAndUser tr");
                groupsAndUser_holder.show();
                groupsAndUserHr_holder.each(function(){
                    if ($(this).data("type")==id.replace("#","")){
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function(){
                    groupsAndUser_holder.append("<tr data-type='"+id.replace("#","")+"' data-id='"+ $(this).attr("id")+"'><td>"+$(this).text()+"</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length <2) {
                    groupsAndUser_holder.hide();
                }
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
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
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

                var idCustomer = $("#customerDd").data("id");
                idCustomer = idCustomer ? idCustomer : null;
                var address = {};
                $("dd").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var salesPersonId = this.$("#salesPerson").data("id");
                salesPersonId = salesPersonId ? salesPersonId : null;
                var salesTeamId = this.$("#salesTeam option:selected").val();
                salesTeamId = salesTeamId ? salesTeamId : null;
                var first = $.trim(this.$el.find("#first").val());
                var last = $.trim(this.$el.find("#last").val());
                var contactName = {
                    first: first,
                    last: last
                };

                var email = $.trim(this.$el.find("#email_person").val());
                var func = $.trim(this.$el.find("#func").val());

                var phone = $.trim(this.$el.find("#phone").val());
                var mobile = $.trim(this.$el.find("#mobile").val());
                var fax = $.trim(this.$el.find("#fax").val());
                var phones = {
                    phone: phone,
                    mobile: mobile,
                    fax: fax
                };
                var workflow = this.$("#workflowsDd").data('id');
                workflow = workflow ? workflow : null;
                var priority = $("#priorityDd").data("id");

                var internalNotes = $.trim($("#internalNotes").val());

                var active;
                if ($("#active").is(":checked")) { console.log("true"); active = true; }
                else { active = false; }

                var optout;
                if ($("#optout").is(":checked")) {
                    optout = true;
                } else {
                    optout = false;
                }

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

                this.currentModel.save({
                    name: name,
                    company: company,
                    campaign: this.$el.find('#campaignDd').data("id"),
                    source: this.$el.find('#sourceDd').data("id"),
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
                    reffered: reffered,
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                }, {
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Leads", { trigger: true });
                    },
                    error: function (models, xhr) {
                        self.hideDialog();
                        (xhr.status == 401) ? Backbone.history.navigate('#login', { trigger: true }):
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
            showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
                
            },

			hideNewSelect:function(){
				$(".newSelectList").hide();
			},

			chooseOption:function(e){
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                if (holder.attr("id") == 'customerDd')
                    this.selectCustomer($(e.target).attr("id"));
			},

            selectCustomer: function (id) {
                dataService.getData('/Customer', {
                    id: id
                }, function (response, context) {
                    var customer = response.data[0];
                    if (customer.type == 'Person') {
                        context.$el.find('#first').val(customer.name.first);
                        context.$el.find('#last').val(customer.name.last);

                        context.$el.find('#company').val('');
                    } else {
                        context.$el.find('#company').val(customer.name.first);

                        context.$el.find('#first').val('');
                        context.$el.find('#last').val('');

                    }
                    context.$el.find('#email').val(customer.email);
                    context.$el.find('#phone').val(customer.phones.phone);
                    context.$el.find('#mobile').val(customer.phones.mobile);
                    context.$el.find('#street').val(customer.address.street);
                    context.$el.find('#city').val(customer.address.city);
                    context.$el.find('#state').val(customer.address.state);
                    context.$el.find('#zip').val(customer.address.zip);
                    context.$el.find('#country').val(customer.address.country);
                }, this);

            },

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    dialogClass: "edit-dialog",
                    width: 800,
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
                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);
				populate.getPriority("#priorityDd",this);
				populate.getWorkflow("#workflowsDd","#workflowNamesDd","/WorkflowsForDd",{id:"Leads"},"name",this);			
				populate.get2name("#customerDd", "/Customer",{},this);	
				populate.get2name("#salesPerson", "/getForDdByRelatedUser",{},this);	
				populate.get("#campaignDd", "/Campaigns",{},"name",this);	
				populate.get("#sourceDd", "/sources",{},"name",this);	

                this.delegateEvents(this.events);

                var model = this.currentModel.toJSON();
                var that = this;
                $("#convert-dialog-form").dialog({
                    autoOpen: false,
                    height: 150,
                    width: 350,
                    modal: true,
                    title: "Convert to opportunity",
                    buttons: {
                        "Create opportunity": function () {
                            var self = this;
                            var id = $("form").data("id");
                            var createCustomer = ($("select#createCustomerOrNot option:selected").val()) ? true : false;
                            that.currentModel.save({
                                isOpportunitie: true,
                                isConverted: true,
								convertedDate:new Date(),
                                createCustomer: createCustomer,
                                expectedRevenue: {
                                    currency: null,
                                    progress: null,
                                    value: null
                                }
                            }, {
                                headers: {
                                    mid: 39
                                },
                                success: function (model) {
                                    $(self).dialog("close");
                                    //that.opportunitiesCollection.add(model);
                                    Backbone.history.navigate("easyErp/Opportunities", { trigger: true });
                                }

                            });

                        },
                        Cancel: function () {
                            $(this).dialog('close');
                        }
                    },

                    close: function () {
                        $(this).dialog('close');
                    }
                }, this);

                if (model.groups)
                    if (model.groups.users.length>0||model.groups.group.length){
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='"+ item._id+"'><td>"+item.departmentName+"</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='"+item._id+"'>"+item.departmentName+"</li>");
                        });
                        model.groups.users.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='"+ item._id+"'><td>"+item.login+"</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='"+item._id+"'>"+item.login+"</li>");
                        });

                    }
                return this;
            }

        });

        return EditView;
    });
