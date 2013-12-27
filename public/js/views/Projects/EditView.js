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
			chooseUser:function(e){
				$(e.target).toggleClass("choosen");
			},
            addUsers: function (e) {
                e.preventDefault();
				$(e.target).closest(".ui-dialog").find(".target").append($(e.target).closest(".ui-dialog").find(".source .choosen"));
            },
            removeUsers: function (e) {

                e.preventDefault();
				$(e.target).closest(".ui-dialog").find(".source").append($(e.target).closest(".ui-dialog").find(".target .choosen"));
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
                    dialogClass: "add-user-dialoga",
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
				$("#sourceUsers li").unbind().on("click",this.chooseUser);
				$("#targetUsers li").unbind().on("click",this.chooseUser);
				$("#addUsers").unbind().on("click",this.addUsers);
				$("#removeUsers").unbind().on("click",this.removeUsers);

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
				$("#sourceGroups li").unbind().on("click",this.chooseUser);
				$("#targetGroups li").unbind().on("click",this.chooseUser);
				$("#addUsersGroups").unbind().on("click",this.addUsers);
				$("#removeUsersGroups").unbind().on("click",this.removeUsers);

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
                var data = {
                    projectName: projectName,
                    projectShortDesc: projectShortDesc,
                    customer: customer ? customer : null,
                    projectmanager: projectmanager ? projectmanager: null,
                    workflow: workflow ? workflow : null,
                    teams: {
                        users: users
                    }

                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    //wait: true,
                    success: function () {
                        $('.edit-project-dialog').remove();
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
				common.populateUsersForGroups('#sourceUsers');
				common.populateUsers("#allUsers", "/Users",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups", "/Departments",null,null);
                common.populateEmployeesDd(App.ID.managerSelect, "/getPersonsForDd", this.currentModel.toJSON());
                common.populateCustomers(App.ID.customerDd, "/Customer", this.currentModel.toJSON());
                common.populateEmployeesDd(App.ID.userEditDd, "/getPersonsForDd");
                common.populateWorkflows("Project", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());
                this.delegateEvents(this.events);

                return this;
            }

        });

        return EditView;
    });
