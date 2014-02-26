define([
    "text!templates/Opportunities/CreateTemplate.html",
    "models/OpportunitiesModel",
    "common",
	"populate",
    "dataService"
],
    function (CreateTemplate, OpportunityModel, common, populate, dataService) {
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                var model = (options && options.model) ? options.model : null;
                this.page=1;
                this.pageG=1;
				this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "change #workflowNames": "changeWorkflows",

                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                "click .prevUserList":"prevUserList",
                "click .nextUserList":"nextUserList",
                "change .inputAttach": "addAttach",
                "click .deleteAttach": "deleteAttach",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect"
            },
			notHide: function () {
				return false;
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
			nextSelect:function(e){
				this.showNewSelect(e,false,true);
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false);
			},
            showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
            },
			chooseOption:function(e){
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                if (holder.attr("id") == 'customerDd')
                    this.selectCustomer($(e.target).attr("id"));
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
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
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

            addUserToTable:function(id) {
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

            unassign:function(e){
                var holder = $(e.target);
                var id = holder.closest("tr").data("id");
                var type = holder.closest("tr").data("type");
                var text = holder.closest("tr").find("td").eq(0).text();
                $("#"+type).append("<option value='"+id+"'>"+text+"</option>");
                holder.closest("tr").remove();
                var groupsAndUser_holder = $(".groupsAndUser");
                if (groupsAndUser_holder.find("tr").length==1){
                    groupsAndUser_holder.hide();
                }

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
            
            addAttach: function () {
                var s = $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length - 1];
                $(".attachContainer").append('<li class="attachFile">' +
                                             '<a href="javascript:;">' + s + '</a>' +
                                             '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
                                             );
                $(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden", "hidden"));
                $(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
            },

            deleteAttach: function (e) {
                $(e.target).closest(".attachFile").remove();
            },
            fileSizeIsAcceptable: function (file) {
                if (!file) { return false; }
                return file.size < App.File.MAXSIZE;
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

                var customerId = this.$("#customerDd").data("id");
                var email = $.trim($("#email").val());


                var salesPersonId = this.$("#salesPersonDd").data("id");
                
                var salesTeamId = this.$("#salesTeamDd").data("id");
                
                var nextAct = $.trim(this.$el.find("#nextActionDate").val());
                var nextActionDesc = $.trim(this.$el.find("#nextActionDescription").val());
                var nextAction = {
                    date: nextAct,
                    desc: nextActionDesc
                };

                var expectedClosing = $.trim($("#expectedClosing").val());
                
                var priority = $("#priorityDd").text();

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

                var workflow = this.$("#workflowDd").data('id');

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
                    wait: true,
                    success: function (model) {
                    	//Attachments (add Vasya)
                        var currentModel = model.changed.success;
                        var currentModelID = currentModel["id"];
                        var addFrmAttach = $("#createOpportunities");
                        var fileArr = [];
                        var addInptAttach = '';
                        $("li .inputAttach").each(function () {
                            addInptAttach = $(this)[0].files[0];
                            fileArr.push(addInptAttach);
                            if (!self.fileSizeIsAcceptable(addInptAttach)) {
                                alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                                return;
                            }
                        });
                        addFrmAttach.submit(function (e) {
                            var bar = $('.bar');
                            var status = $('.status');

                            var formURL = "http://" + window.location.host + "/uploadOpportunitiesFiles";
                            e.preventDefault();
                            addFrmAttach.ajaxSubmit({
                                url: formURL,
                                type: "POST",
                                processData: false,
                                contentType: false,
                                data: [fileArr],

                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader("id", currentModelID);
                                    status.show();
                                    var statusVal = '0%';
                                    bar.width(statusVal);
                                    status.html(statusVal);
                                },

                                uploadProgress: function (event, position, total, statusComplete) {
                                    var statusVal = statusComplete + '%';
                                    bar.width(statusVal);
                                    status.html(statusVal);
                                },

                                success: function () {
                                    console.log('Attach file');
                                    addFrmAttach[0].reset();
                                    status.hide();
                                    self.hideDialog();
                                    Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                                },

                                error: function () {
                                    console.log("Attach file error");
                                }
                            });
                        });
                        if (fileArr.length > 0) {
                            addFrmAttach.submit();
                        }
                        else {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });

                        }
                        addFrmAttach.off('submit');

                    },
                    error: function (model, xhr) {
						if (xhr && (xhr.status === 401||xhr.status === 403)) {
							if (xhr.status === 401){
								Backbone.history.navigate("login", { trigger: true });
							}else{
								alert("You do not have permission to perform this action");								
							}
                        } else {
						if (xhr&&xhr.status === 400&&xhr.responseJSON){
							alert(xhr.responseJSON.error);
						}else{
							Backbone.history.navigate("easyErp/Opportunities", { trigger: true });
						}
                        }

                    }
                });
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    dialogClass: "edit-dialog",
                    width: "900",
                    title: "Create Opportunity",
                    buttons: {
                        save: {
                            text: "Create",
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
                common.populateUsers("#allUsers", "/UsersForDd",null,null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",null,this.pageG);


                $('#nextActionDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                $('#expectedClosing').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
				populate.getPriority("#priorityDd",this,true);
				populate.get2name("#customerDd", "/Customer",{},this,true,true, (this.model)?this.model._id:null);
				populate.get2name("#salesPersonDd", "/getForDdByRelatedUser",{},this,true,true);
				populate.getWorkflow("#workflowDd","#workflowNamesDd","/WorkflowsForDd",{id:"Opportunities"},"name",this,true);
				populate.get("#salesTeamDd", "/DepartmentsForDd",{},"departmentName",this,true,true);
			
/*                common.populateCustomers("#customerDd", "/Customer",this.model);
                //common.populateEmployeesDd("#salesPerson"Dd, "/getSalesPerson");
                common.populateEmployeesDd("#salesPersonDd", "/getForDdByRelatedUser", this.model);
                common.populateDepartments("#salesTeamDd", "/DepartmentsForDd");
                common.populatePriority("#priorityDd", "/Priority");
                common.populateWorkflows('Opportunities', '#workflowDd', "#workflowNamesDd", '/WorkflowsForDd');*/
				
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
