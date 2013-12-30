define([
    "text!templates/Projects/EditTemplate.html",
    "custom",
    "common",
    "dataService"
],
    function (EditTemplate, Custom, common, dataService) {

        var EditView = Backbone.View.extend({
            contentType: "Projects",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
				this.page=1;
				this.pageG=1;
                this.render();
            },

            events: {
                "click .breadcrumb a": "changeWorkflow",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
			    'click #addUsers':'addUsers',
			    'click #removeUsers':'removeUsers'

            },
			nextUserList:function(e,page){
				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,page);
			},
			prevUserList:function(e,page){
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

			chooseUser:function(e){
				$(e.target).toggleClass("choosen");
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
				$(".nextUserList").unbind().on("click",function(e){
					self.page+=1
					self.nextUserList(e,self.page)
				});
				$(".prevUserList").unbind().on("click",function(e){
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
				$(".nextGroupList").unbind().on("click",function(e){
					self.pageG+=1
					self.nextUserList(e,self.pageG)
				});
				$(".prevGroupList").unbind().on("click",function(e){
					self.pageG-=1
					self.prevUserList(e,self.pageG)
				});
			},

			changeTab:function(e){
				$(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
				$(e.target).addClass("active");
				var n= $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
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

            hideDialog: function () {
                $('.edit-project-dialog').remove();
				$(".add-group-dialog").remove();
				$(".add-user-dialog").remove();
                Backbone.history.navigate("home/content-" + 'Projects');
            },

            changeWorkflow: function (e) {
                var mid = 39;
                var breadcrumb = $(e.target).closest('li');
                var a = breadcrumb.siblings().find("a");
                if (a.hasClass("active")) {
                    a.removeClass("active");
                }
                breadcrumb.find("a").addClass("active");
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: breadcrumb.data("name"),
                        status: breadcrumb.data("status")
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }

                });

            },

            saveItem: function (event) {
                event.preventDefault();
                var self = this;

                var mid = 39;
                var projectName = $.trim(this.$el.find("#projectName").val());
                var projectShortDesc = $.trim(this.$el.find("#projectShortDesc").val());
                var customer = this.$el.find("#customerDd option:selected").val();
                var projectmanager = this.$el.find("#projectManagerDD option:selected").val();
                var workflow = this.$el.find("#workflowsDd option:selected").val();
                console.log(workflow);
                var $userNodes = $("#usereditDd option:selected"), users = [];
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
                var data = {
                    projectName: projectName,
                    projectShortDesc: projectShortDesc,
                    customer: customer ? customer : null,
                    projectmanager: projectmanager ? projectmanager: null,
                    workflow: workflow ? workflow : null,
                    teams: {
                        users: users
                    },
                    groups: {
						owner: $("#allUsers").val(),
						users: usersId,
						group: groupsId
                    },
                    whoCanRW: whoCanRW


                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    //wait: true,
                    success: function () {
                        $('.edit-project-dialog').remove();
						$(".add-group-dialog").remove();
						$(".add-user-dialog").remove();
                        Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        $('.edit-project-dialog').remove();
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },

            changeWorkflowValues: function () {
                this.$("#workflowValue").html("");
                var that = this;
                var choosedWorkflow = _.filter(that.workflows, function (workflow) {
                    return workflow.wId == that.$("#workflowDd option:selected").val();
                });
                console.log(this.currentModel.get('workflow')._id);
                _.each(choosedWorkflow, function (value,key) {
                    this.currentModel.get('workflow')._id === value._id ?
                        this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ).attr('selected', 'selected')):
                        this.$("#workflowValue").append( $('<option/>').val(value._id).text(value.name + " (" + value.status + ")" ));
                },this);
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
                                $('.edit-project-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-project-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                var aaa = 'lol';
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    title: "Edit Project",
                    dialogClass: "edit-project-dialog",
                    width: "950px",
                    //height: 225,
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
                        },
                        delete:{
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
				common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
				common.populateUsers("#allUsers", "/Users",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/Departments",this.currentModel.toJSON(),this.pageG);
                common.populateEmployeesDd(App.ID.managerSelect, "/getPersonsForDd", this.currentModel.toJSON());
                common.populateCustomers(App.ID.customerDd, "/Customer", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.userEditDd, "/getPersonsForDd");
                common.populateWorkflows("Project", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());
				var model = this.currentModel.toJSON();
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
						})

					}
                this.delegateEvents(this.events);

                return this;
            }

        });

        return EditView;
    });
