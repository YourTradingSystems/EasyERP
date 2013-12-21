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
                this.render();
            },

            events: {
                'click #sourceUsersProject': 'a',
                "submit form": "formSubmitHandler",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #add-button': 'addToTarget',
                'click #targetUsers li': 'chooseUser',
			    'click #addUsers':'addUsers',
			    'click #removeUsers':'removeUsers'

            },
			a:function(e){
				alert();
				$(e.target).toggleClass("choosen");
			},
            addUsers: function (e) {
                e.preventDefault();
				alert();
                $('#targetUsers').append($('#sourceUsers .choosen'));
            },
            removeUsers: function (e) {
                e.preventDefault();
                $('#sourceUsers').append($('#targetUsers .choosen'));
            },

			addToTarget:function(e){
				alert();
//				$(e.target).closest(".ui-dialog").find("select").eq(1).hide();
//				$(e.target).closest(".ui-dialog").find("select").eq(1).append($(e.target).closest(".ui-dialog").find("select").eq(0).find("option"));
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
				$(id).find("option:selected").each(function(){
					$(".groupsAndUser").append("<tr data-type='"+id.replace("#","")+"' data-id='"+ $(this).val()+"'><td>"+$(this).text()+"</td><td class='text-right'></td></tr>");
					$(this).remove();
				});
			},
			addUser:function(e){
				var self = this;
				$(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "250px;",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",

                            click: function(){
								click: self.addUserToTable("#allUsers")
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
			},
			addGroup:function(e){
				var self = this;
				$(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "100px;",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",
                            click: function(){
								self.addUserToTable("#allGroup")
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
					if ($(this).data("type")=="allUsers"){
						usersId.push($(this).data("id"));
					}
					if ($(this).data("type")=="allGroup"){
						groupsId.push($(this).data("id"));
					}

				});
                this.model.save({
                    projectName: $.trim(this.$el.find("#projectName").val()),
                    projectShortDesc: $.trim(this.$el.find("#projectShortDesc").val()),
                    customer: customer ? customer : "",
                    projectmanager: projectmanager ? projectmanager : "",
                    workflow: workflow ? workflow : "",
                    groups: {
						owner: ($("#owner").prop("checked")?$("allUsers option:selected").val():null),
						users: usersId,
						group: groupsId
                    }
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
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "50%",
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
				common.populateUsersForGroups('#sourceUsersProject');
                common.populateEmployeesDd(App.ID.managerSelect, "/getPersonsForDd");
                common.populateCustomers(App.ID.customerDd, "/Customer");
//                common.populateUsers("#allUsers", "/Users",null,null,true);
//                common.populateDepartments("#allGroup", "/Departments",null,null, true);
                common.populateEmployeesDd(App.ID.userEditDd, "/getPersonsForDd");
                common.populateWorkflows("Project", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows");
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
