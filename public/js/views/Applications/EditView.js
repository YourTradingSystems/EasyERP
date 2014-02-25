define([
    "text!templates/Applications/EditTemplate.html",
    'text!templates/Notes/AddAttachments.html',
    'collections/Workflows/WorkflowsCollection',
    "common",
    "custom",
	"populate",
	"custom"
],
    function (EditTemplate, addAttachTemplate, WorkflowsCollection, common, Custom, populate, custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            imageSrc: '',
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.workflowsCollection = new WorkflowsCollection({id:'Applications'});
                this.employeesCollection = options.collection;
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.page = 1;
                this.pageG = 1;
				this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #refuse": "changeWorkflow",
//                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler',
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers': 'addUsers',
                'click #removeUsers': 'removeUsers',
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
				"click .hireEmployee": "isEmployee",
                "click .refuseEmployee": "refuseEmployee",
            },
			refuseEmployee:function (e) {
				var self = this;
                var workflow = this.workflowsCollection.findWhere({name: "Refused"});
                if(!workflow)
                {
                    throw new Error('Workflow "Refused" not found');
                    return;
                }
                var id = workflow.get('_id');
                this.currentModel.save({
                    workflow:id
                }, {
                    success: function (model) {
						model = model.toJSON();
						var viewType = custom.getCurrentVT();
						switch (viewType) {
						case 'list':
							{
                                $("tr[data-id='" + model._id + "'] td").eq(6).find("a").text("Refused");
							}
							break;
						case 'kanban':
							{
								$(".column[data-id='"+id+"']").find(".columnNameDiv").after($("#" + model._id));
							}
						}
						self.hideDialog();
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("easyErp", { trigger: true });
                    }
                });
				return false;

            },
            isEmployee: function (e) {
				e.preventDefault();
            	this.currentModel.save({
                    isEmployee: true
                },{
                    headers: {
                        mid: 39
                    },
					patch:true,
                    success: function () {
                        Backbone.history.navigate("easyErp/Employees", { trigger: true });
                    }
                });
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

            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n= holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            addUser: function () {
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons: {
                        save: {
                            text: "Choose",
                            class: "btn",

                            click: function () {
                                self.addUserToTable("#targetUsers");
                                $(this).dialog("close");
                            }

                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    }

                });
                $("#targetUsers").unbind().on("click", "li", this.removeUsers);
                $("#sourceUsers").unbind().on("click", "li", this.addUsers);
                $(document).on("click", ".nextUserList", function (e) {
                    self.page += 1;
                    self.nextUserList(e, self.page);
                });
                $(document).on("click", ".prevUserList", function (e) {
                    self.page -= 1;
                    self.prevUserList(e, self.page);
                });

            },

            addGroup: function () {
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons: {
                        save: {
                            text: "Choose",
                            class: "btn",
                            click: function () {
                                self.addUserToTable("#targetGroups");
                                $(this).dialog("close");
                            }
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    }

                });
                $("#targetGroups").unbind().on("click", "li", this.removeUsers);
                $("#sourceGroups").unbind().on("click", "li", this.addUsers);
                $(document).unbind().on("click", ".nextGroupList", function (e) {
                    self.pageG += 1;
                    self.nextUserList(e, self.pageG);
                });
                $(document).unbind().on("click", ".prevGroupList", function (e) {
                    self.pageG -= 1;
                    self.prevUserList(e, self.pageG);
                });
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

            chooseUser: function (e) {
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
                if (groupsAndUserHr_holder.length<2){
                    groupsAndUser_holder.hide();
                }
            },
            fileSizeIsAcceptable: function (file) {
                if (!file) { return false; }
                return file.size < App.File.MAXSIZE;
            },
            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.currentModel;
                var currentModelID = currentModel["id"];
                var addFrmAttach = $("#createApplicationForm");
                var addInptAttach = $(".input-file .inputAttach")[0].files[0];
                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
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
                        data: [addInptAttach],

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

                        success: function (data) {
                            var attachments = currentModel.get('attachments');
                            attachments.length = 0;
                            $('.attachContainer').empty();
                            data.data.attachments.forEach(function (item) {
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
                });
                addFrmAttach.submit();
                addFrmAttach.off('submit');
            },
            deleteAttach: function (e) {
                if ($(e.target).closest("li").hasClass("attachFile")) {
                    $(e.target).closest(".attachFile").remove();
                }
                else {
                    var id = e.target.id;
                    var currentModel = this.currentModel;
                    var attachments = currentModel.get('attachments');
                    var new_attachments = _.filter(attachments, function (attach) {
                        if (attach._id != id) {
                            return attach;
                        }
                    });
                    currentModel.save({'attachments': new_attachments},
                                      {
                                          headers: {
                                              mid: 39
                                          },
										  patch:true,
                                          success: function (model, response, options) {
                                              $('.attachFile_' + id).remove();
                                          }
                                      });
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

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
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

            saveItem: function () {
                var self = this;
                var mid = 39;
                var viewType = custom.getCurrentVT();
                var relatedUser = this.$el.find("#relatedUsersDd option:selected").val();
                relatedUser = relatedUser ? relatedUser : null;

                var department = this.$el.find("#departmentDd").data("id");
                department = department ? department : null;

                var nextAction = $.trim(this.$el.find("#nextAction").val());
                /*var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }*/
                var jobPositionId = this.$el.find("#jobPositionDd").data("id") ? this.$el.find("#jobPositionDd").data("id") : null;
                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var workflow= this.$el.find("#workflowsDd").data("id") ? this.$el.find("#workflowsDd").data("id") : null;
                var data = {
                    //subject: this.$el.find("#subject").val(),
                    imageSrc: this.imageSrc,
                    name: {
                        first: this.$el.find("#first").val(),
                        last: this.$el.find("#last").val()
                    },
                    personalEmail: $.trim(this.$el.find("#pemail").val()),
                    workPhones: {
                        phone: $.trim(this.$el.find("#phone").val()),
                        mobile: $.trim(this.$el.find("#mobile").val())
                    },
                    degree: this.$el.find("#degreesDd option:selected").val(),
                    relatedUser: relatedUser,
                    nextAction: nextAction,
                    source: this.$el.find("#sourceDd").data("id"),
                    jobType: this.$el.find("#jobTypeDd").data("id"),
                    referredBy: $.trim(this.$el.find("#referredBy").val()),
                    department: department,
                    jobPosition: jobPositionId,
                    expectedSalary: $.trim(this.$el.find("#expectedSalary").val()),
                    proposedSalary: $.trim(this.$el.find("#proposedSalary").val()),
                    tags: $.trim(this.$el.find("#tags").val()).split(','),
                    otherInfo: this.$el.find("#otherInfo").val(),
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                };
                var currentWorkflow = this.currentModel.get('workflow');
                if (currentWorkflow._id && (currentWorkflow._id != workflow)) {
                    data['workflow'] = workflow;
                    data['sequence'] = -1;
                    data['sequenceStart'] =  this.currentModel.toJSON().sequence;
                    data['workflowStart'] = currentWorkflow._id;
                };
                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    patch: true,
                    success: function (model, result) {
                        model = model.toJSON();
						result = result.result;
                        var editHolder = self.$el;
						switch (viewType) {
                        case 'list':
                            {
								var tr_holder = $("tr[data-id='" + model._id + "'] td");
                                tr_holder.eq(2).text(data.name.first+" "+data.name.last);
                                tr_holder.eq(3).text(data.personalEmail);
                                tr_holder.eq(4).find("a").text(data.workPhones.phone).attr("href","skype:"+data.workPhones.phone+"?call");
                                tr_holder.eq(5).text(self.$el.find("#jobPositionDd").text());
                                tr_holder.eq(6).find("a").text(self.$el.find("#workflowsDd").text());
                                tr_holder.eq(7).text(data.jobType);
                            }
                            break;
                        case 'kanban':
                            {
                                var kanban_holder = $("#" + model._id);
                                kanban_holder.find(".application-header .left").html(data.name.first+"<br/>"+data.name.last);
								if (parseInt(data.proposedSalary))
									kanban_holder.find(".application-header .right").text(data.proposedSalary+"$");
                                kanban_holder.find(".application-content p.center").text(self.$el.find("#jobPositionDd").text());
                                kanban_holder.find(".application-content p.right").text(nextAction);

                                if (result && result.sequence){
									$("#" + data.workflowStart).find(".item").each(function () {
										var seq = $(this).find(".inner").data("sequence");
										if (seq > data.sequenceStart) {
											$(this).find(".inner").attr("data-sequence", seq - 1);
										}
									});
                                    kanban_holder.find(".inner").attr("data-sequence", result.sequence);
								}

                                $(".column[data-id='" + data.workflow+"']").find(".columnNameDiv").after(kanban_holder);

                            }
                        }
                        self.hideDialog();
                    },
                    error: function () {
                        Backbone.history.navigate("easyErp", { trigger: true });
                        self.hideDialog();
                    }
                });

            },
            deleteItem: function (event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function (model) {
							model = model.toJSON();
							var viewType = custom.getCurrentVT();
							switch (viewType) {
							case 'list':
								{
									$("tr[data-id='" + model._id + "'] td").remove();
								}
								break;
							case 'kanban':
								{
									$("#" + model._id).remove();
									//count kanban
									var wId = model.workflow._id;
									var newTotal = ($("td[data-id='" + wId + "'] .totalCount").html()-1);
									$("td[data-id='" + wId + "'] .totalCount").html(newTotal);
								}
							}
							self.hideDialog();

                        },
                        error: function () {
                            $('.applications-edit-dialog').remove();
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
                }
            },
            hideNewSelect: function (e) {
                $(".newSelectList").hide();
            },
              showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
                
            },


            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
            },

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    dialogClass: "edit-dialog",
                    width: 690,
                    title: "Edit Application",
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
                        delete: {
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', this.currentModel.toJSON(), this.page);
                common.populateUsers("#allUsers", "/UsersForDd", this.currentModel.toJSON(), null, true);
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/DepartmentsForDd", this.currentModel.toJSON(), this.pageG);
				populate.getWorkflow("#workflowsDd","#workflowNamesDd","/WorkflowsForDd",{id:"Applications"},"name",this);
				populate.get("#departmentDd","/DepartmentsForDd",{},"departmentName",this);
				populate.get("#jobPositionDd","/JobPositionForDd",{},"name",this);
				populate.get("#jobTypeDd","/jobType",{},"_id",this);
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                $('#nextAction').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: this.currentModel.toJSON().creationDate
                });

                var model = this.currentModel.toJSON();
                if (model.groups)
                    if (model.groups.users.length > 0 || model.groups.group.length) {
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.departmentName + "</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='" + item._id + "'>" + item.departmentName + "</li>");
                        });
                        model.groups.users.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='" + item._id + "'>" + item.login + "</li>");
                        });

                    }
                return this;
            }

        });
        return EditView;
    });
