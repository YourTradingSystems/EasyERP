define([
    "text!templates/Projects/EditTemplate.html",
    "custom",
    "common",
    "dataService",
    'text!templates/Notes/AddAttachments.html',
    'text!templates/Notes/AddNote.html',
],
    function (EditTemplate, Custom, common, dataService,addAttachTemplate,addNoteTemplate) {

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
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
			    'click #addUsers':'addUsers',
			    'click #removeUsers':'removeUsers',
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
                "click #addNote": "addNote",
                "click .editDelNote": "editDelNote",
                "click #cancelNote": "cancelNote",
                "click #noteArea" : "expandNote",
                "click #cancelNote" : "cancelNote",
                "click .addTitle" : "showTitle",
                "click .editNote" : "editNote",
	        },
	        
	        cancelNote: function (e) {
                $('#noteArea').val('');
                $('#noteTitleArea').val('');
                $('#getNoteKey').attr("value", '');
            },
            editDelNote: function (e) {
                var id = e.target.id;
                var k = id.indexOf('_');
                var type = id.substr(0, k);
                var id_int = id.substr(k + 1);


                var currentModel =  this.currentModel;
                var notes = currentModel.get('notes');

                switch (type) {
                    case "edit": {
                        $('#noteArea').val($('#' + id_int).find('.noteText').text());
                        $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                        $('#getNoteKey').attr("value", id_int);
                        break;
                    }
                    case "del": {

                        var new_notes = _.filter(notes, function (note) {
                            if (note._id != id_int) {
                            	console.log(note);
                                return note;
                            }
                        });
                        currentModel.set('notes', new_notes);
                        currentModel.save({},
                                {
                                    headers: {
                                        mid: 39,
                                        remove: true
                                    },
                                    
                                    wait: true,
                                    success: function (models) {
                                    	console.log(models);
                                        $('#' + id_int).remove();
                                    }
                                });
                        break;
                    }
                }
            },

            addNote: function (e) {
            	e.preventDefault();
                var val = $('#noteArea').val().replace(/</g,"&#60;").replace(/>/g,"&#62;");
                var title = $('#noteTitleArea').val().replace(/</g,"&#60;").replace(/>/g,"&#62;");
                if (val || title) {
                    var notes = this.currentModel.get('notes');
                    var arr_key_str = $('#getNoteKey').attr("value");
                    var note_obj = {
                        note: '',
                        title: ''
                    };
                    if (arr_key_str) {
                        var edit_notes = _.filter(notes, function (note) {
                            if (note._id == arr_key_str) {
                                note.note = val;
                                note.title = title;
                                return note;
                            }
                        });
                        this.currentModel.save({},
                                   {
                                       headers: {
                                           mid: 39
                                       },
                                       success: function (model, response, options) {
                                           $('#noteBody').val($('#' + arr_key_str).find('.noteText').html(val));
                                           $('#noteBody').val($('#' + arr_key_str).find('.noteTitle').html(title));
                                           $('#getNoteKey').attr("value", '');
                                       }
                                   });



                    } else {

                        note_obj.note = val;
                        note_obj.title = title;
                        notes.push(note_obj);
                        this.currentModel.set('notes', notes);
                        this.currentModel.save({},
                                    {
                                        headers: {
                                            mid: 39,
                                            
                                        },
                                        wait: true,
                                        success: function (models,data,response) {

            								$('#noteBody').empty();
            								data.notes.forEach(function(item){
            									var date = common.utcDateToLocaleDate(item.date);

            									$('#noteBody').prepend(_.template(addNoteTemplate, { id: item._id, title:item.title, val:item.note, author:item.author, date: date }));
            							});
                                        }
                                    });

                    }
                    $('#noteArea').val('');
                    $('#noteTitleArea').val('');
                }
            },
            
            editNote : function(e){
    			$(".title-wrapper").show();
    			$("#noteArea").attr("placeholder","").parents(".addNote").addClass("active");
    		},
    		expandNote : function(e){
    			if (!$(e.target).parents(".addNote").hasClass("active")){
    				$(e.target).attr("placeholder","").parents(".addNote").addClass("active");
    				$(".addTitle").show();
    			}
            },
    		cancelNote : function(e){
    			$(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
    			$(".title-wrapper").hide();
    			$(".addTitle").hide();
            },

    		saveNote : function(e){
    			if (!($(e.target).parents(".addNote").find("#noteArea").val()=="" && $(e.target).parents(".addNote").find("#noteTitleArea").val()=="")){
    				$(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
    				$(".title-wrapper").hide();
    				$(".addTitle").hide();
    			}
    			else{
    				$(e.target).parents(".addNote").find("#noteArea").focus();
    			}
            },

    		showTitle : function(e){
    			$(e.target).hide().parents(".addNote").find(".title-wrapper").show().find("input").focus();
            },

	            
	        fileSizeIsAcceptable: function(file){
	                if(!file){return false;}
	                return file.size < App.File.MAXSIZE;
	        },
	        addAttach: function (event) {
	                event.preventDefault();
	                var currentModel = this.currentModel;
	                var currentModelID = currentModel["id"];
	                var addFrmAttach = $("#editProjectForm");
	                var addInptAttach = $(".input-file .inputAttach")[0].files[0];
	                if(!this.fileSizeIsAcceptable(addInptAttach)){
	                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
	                    return;
	                }
	                addFrmAttach.submit(function (e) {
	                    var bar = $('.bar');
	                    var status = $('.progress_status');
	                    var formURL = "http://" + window.location.host + "/uploadProjectsFiles";
	                    e.preventDefault();
	                    addFrmAttach.ajaxSubmit({
	                        url: formURL,
	                        type: "POST",
	                        processData: false,
	                        contentType: false,
	                        data: [addInptAttach],

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
	                        
	                        success: function (data) {
	                            var attachments = currentModel.get('attachments');
	  							attachments.length=0;
								$('.attachContainer').empty();
								
								data.attachments.forEach(function(item){
									var date = common.utcDateToLocaleDate(item.uploadDate);
									attachments.push(item);
									$('.attachContainer').prepend(_.template(addAttachTemplate, { data: item, date: date }));
							});
	                            console.log('Attach file');
	                            addFrmAttach[0].reset();
	                            status.hide();
	                        },

	                        error: function () {
	                            console.log("Attach file error");
	                        }
	                    });
					})
					addFrmAttach.submit();
					addFrmAttach.off('submit');
			},
				
			deleteAttach: function (e) {
						if ($(e.target).closest("li").hasClass("attachFile")){
							$(e.target).closest(".attachFile").remove();
						}
						else{
							var id = e.target.id;
							var currentModel = this.currentModel;
							var attachments = currentModel.get('attachments');
							var new_attachments = _.filter(attachments, function (attach) {
								if (attach._id != id) {
									return attach;
								}
							});
							currentModel.set('attachments', new_attachments);
							currentModel.save({},
											  {
												  headers: {
													  mid: 39
												  },

												  success: function (model, response, options) {
													  $('.attachFile_' + id).remove();
												  }
											  });
						}
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
                var projecttype = this.$el.find("#projectTypeDD option:selected").val();
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
                    projecttype:projecttype ? projecttype : "",
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
                    width: "900px",
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
				common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);
                common.populateEmployeesDd("#projectManagerDD", "/getPersonsForDd", this.currentModel.toJSON());
                common.populateCustomers("#customerDd", "/Customer", this.currentModel.toJSON());
                common.populateEmployeesDd("#userEditDd", "/getPersonsForDd");
                common.populateWorkflows("Projects", "#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", this.currentModel.toJSON());
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
