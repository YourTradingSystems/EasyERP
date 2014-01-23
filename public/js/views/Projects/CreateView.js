define([
    "text!templates/Projects/CreateTemplate.html",
    "models/ProjectsModel",
    "common"
],
    function (CreateTemplate, ProjectModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                this.model = new ProjectModel();
				this.page=1;
				this.pageG=1;
                this.render();
            },

            events: {
				'click #workflowNamesDd': 'chooseUser',
                "submit form": "formSubmitHandler",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign'

            },
			nextUserList:function(e,page){
				var self= this;
				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,page);
			},
			prevUserList:function(e,page){
				var self= this;
				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,page);
			},
			nextGroupList:function(e,page){
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/Departments",null,this.pageG,null);
			},
			prevGroupList:function(e,page){
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/Departments",null,this.pageG,null);
			},

            addUsers: function (e) {
                e.preventDefault();
				$(e.target).closest(".ui-dialog").find(".target").append($(e.target));

            },
            removeUsers: function (e) {
                e.preventDefault();
				$(e.target).closest(".ui-dialog").find(".source").append($(e.target));
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
				$(document).on("click",".nextUserList",function(e){
					self.page+=1
					self.nextUserList(e,self.page)
				});
				$(document).on("click",".prevUserList",function(e){
					self.page-=1
					self.prevUserList(e,self.page)
				});
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
				$(document).unbind().on("click",".nextGroupList",function(e){
					self.pageG+=1
					self.nextUserList(e,self.pageG)
				});
				$(document).unbind().on("click",".prevGroupList",function(e){
					self.pageG-=1
					self.prevUserList(e,self.pageG)
				});

			},

			changeTab:function(e){
				$(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
				$(e.target).addClass("active");
				var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
				$(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
				$(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
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
            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status, _id: value[i]._id });
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsDdCollection.findWhere({ name: name }).toJSON().value;
                $("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
            },

            formSubmitHandler: function (event) {
                event.preventDefault();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;
                var customer = this.$el.find("#customerDd option:selected").val();
                var projectmanager = this.$el.find("#projectManagerDD option:selected").val();
                var workflow = this.$el.find("#workflowsDd option:selected").data("id");
                var $userNodes = this.$el.find("#usereditDd option:selected"), users = [];
                console.log(workflow);
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
                        name: val.innerHTML
                    });
                });
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
                    projectName: $.trim(this.$el.find("#projectName").val()),
                    projectShortDesc: $.trim(this.$el.find("#projectShortDesc").val()),
                    customer: customer ? customer : "",
                    projectmanager: projectmanager ? projectmanager : "",
                    workflow: workflow ? workflow : "",
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
                    //wait: true,
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                    },
                    error: function (model, statusText, xhr) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
				$(".add-group-dialog").remove();
				$(".add-user-dialog").remove();
            },
            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "900",
                    title: "Create Project",
                    buttons:{
                        save:{
                            text:"Save",
                            class:"btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });
				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
                common.populateEmployeesDd(App.ID.managerSelect, "/getPersonsForDd");
                common.populateCustomers(App.ID.customerDd, "/Customer");
				common.populateUsers("#allUsers", "/Users",null,null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",null,this.pageG);
                common.populateEmployeesDd(App.ID.userEditDd, "/getPersonsForDd");
                common.populateWorkflows("Project", App.ID.workflowDd, App.ID.workflowNamesDd, "/WorkflowsForDd");
                
                $('#StartDate').datepicker({ dateFormat: "d M, yy", minDate: new Date() });
                $('#EndDate').datepicker({
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
