define([
    "text!templates/Applications/CreateTemplate.html",
    "models/ApplicationsModel",
    "common",
	"populate"
],
    function (CreateTemplate, ApplicationModel, common, populate) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new ApplicationModel();
                this.page=1;
                this.pageG=1;
				this.responseObj = {};
                this.render();
            },
            events: {
                "click #tabList a": "switchTab",
                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "change .inputAttach": "addAttach",
				"click .deleteAttach":"deleteAttach",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                "click .prevUserList":"prevUserList",
                "click .nextUserList":"nextUserList",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
            },
            notHide: function (e) {
				return false;
            },

			nextSelect:function(e){
				this.showNewSelect(e,false,true);
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false);
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

			deleteAttach:function(e){
				$(e.target).closest(".attachFile").remove();
			},
            addAttach: function (event) {
				var s= $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length-1];
				$(".attachContainer").append('<li class="attachFile">'+
											 '<a href="javascript:;">'+s+'</a>'+
											 '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
											 );
				$(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden","hidden"));
				$(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
			},
            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
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
                //$("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
            },

            isEmployee: function (e) {
                $(e.target).addClass("pressed");
                this.saveItem();
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
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },
            fileSizeIsAcceptable: function(file){
                if(!file){return false;}
                return file.size < App.File.MAXSIZE;
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var isEmployee = false;
                if (this.$("#hire>span").hasClass("pressed")) {
                    isEmployee = true;
                    self.contentType = "Employees";
                }
                //var subject = $.trim($("#subject").val());
                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var name = {
                    first: first,
                    last: last
                };
                var pemail = $.trim($("#pemail").val());
                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var wphones = {
                    phone: phone,
                    mobile: mobile
                };

                var workflow = $("#workflowsDd").data("id");
                var relatedUserId = $("#relatedUsersDd option:selected").val();
                var nextAction = $.trim($("#nextAction").val());
                /*var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }*/
                var sourceId = $("#sourceDd").data("id");
                var referredBy = $.trim($("#referredBy").val());
                var departmentId = $("#departmentDd").data("id");

                var jobPositionId = $("#jobPositionDd").data("id");
                var jobType= this.$el.find("#jobTypeDd").data("id");
                var expectedSalary = $.trim($("#expectedSalary").val());
                var proposedSalary = $.trim($("#proposedSalary").val());
                var tags = $.trim($("#tags").val()).split(',');
                var otherInfo = $("#otherInfo").val();

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
                this.model.save({
                    isEmployee: isEmployee,
                    imageSrc: this.imageSrc,
                    name: name,
                    personalEmail: pemail,
                    workPhones: wphones,
                    relatedUser: relatedUserId,
                    nextAction: nextAction,
                    source: sourceId,
                    referredBy: referredBy,
                    department: departmentId,
                    jobPosition: jobPositionId,
                    expectedSalary: expectedSalary,
                    proposedSalary: proposedSalary,
                    tags: tags,
					jobType:jobType,
                    otherInfo: otherInfo,
                    workflow: workflow,
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
                    success: function (model, response) {
                        Backbone.history.fragment = '';
                        var currentModelID = response.id || (new Date()).valueOf();
						var addFrmAttach = $("#createApplicationForm");
						var fileArr= [];
						var addInptAttach = '';
						$("li .inputAttach").each(function(){
							addInptAttach = $(this)[0].files[0];
							fileArr.push(addInptAttach);
							if(!self.fileSizeIsAcceptable(addInptAttach)){
								alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
								return;
							}
						});
							addFrmAttach.submit(function (e) {
								var bar = $('.bar');
								var status = $('.status');
								
								var formURL = "http://" + window.location.host + "/uploadApplicationFiles";
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
									
									uploadProgress: function(event, position, total, statusComplete) {
										var statusVal = statusComplete + '%';
										bar.width(statusVal);
										status.html(statusVal);
									},
									
									success: function () {
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
						if(fileArr.length>0){
							addFrmAttach.submit();
						}
						else{
							self.hideDialog();
							Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });

						}
						addFrmAttach.off('submit');

                    },
                    error: function (model, xhr) {
                        self.hideDialog();
						if (xhr && (xhr.status === 401||xhr.status === 403)) {
							if (xhr.status === 401){
								Backbone.history.navigate("login", { trigger: true });
							}else{
								alert("You do not have permission to perform this action");								
							}
                        } else {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    }

                });
            },
			hideNewSelect:function(){
				$(".newSelectList").hide();
			},
            showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
            },

			chooseOption:function(e){
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
			},

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    dialogClass: "edit-dialog create-app-dialog",
                    width: 690,
                    title: "Create Application",
                    buttons:{
                        save:{
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
                common.populateUsers("#allUsers", "/UsersForDd",null,null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",null,this.pageG);
				populate.getWorkflow("#workflowsDd","#workflowNamesDd","/WorkflowsForDd",{id:"Applications"},"name",this,true);
				populate.get("#departmentDd","/DepartmentsForDd",{},"departmentName",this,true);
				populate.get("#jobPositionDd","/JobPositionForDd",{},"name",this,true);
				populate.get("#jobTypeDd","/jobType",{},"_id",this,true);
                common.canvasDraw({ model: this.model.toJSON() }, this);
                $('#nextAction').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: new Date()
                });
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
