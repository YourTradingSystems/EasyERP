define([
    "text!templates/Projects/CreateTemplate.html",
    "models/ProjectsModel",
    "common",
	"populate"
],
    function (CreateTemplate, ProjectModel, common, populate) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",
            template: _.template(CreateTemplate),

            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new ProjectModel();
                this.page = 1;
                this.pageG = 1;
                this.responseObj = {};
                this.render();
            },

            events: {
                'click #workflowNamesDd': 'chooseUser',
                "submit form": "formSubmitHandler",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                "change .inputAttach": "addAttach",
                "click .deleteAttach": "deleteAttach",
                "click #health a": "showHealthDd",
                "click #health ul li div": "chooseHealthDd",
                "click": "hideHealth",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .current-selected": "showNewSelect"

            },
            notHide: function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            hideHealth: function () {
                $(".newSelectList").hide();
                $("#health ul").hide();

            },

            chooseHealthDd: function (e) {
                $(e.target).parents("#health").find("a").attr("class", $(e.target).attr("class")).attr("data-value", $(e.target).attr("class").replace("health", "")).parent().find("ul").toggle();
            },

            showHealthDd: function (e) {
                $(e.target).parent().find("ul").toggle();
                return false;
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
					if (el.parents(".groupsChooser").length!=0){
						el.find(".userPagination").prepend("<a class='prevGroupList' href='javascript:;'>« prev</a>");
					}else{
						el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");

					}

				}
				if (count===0){
					s+="0-0 of 0";
				}else{
					if ((page)*20-1<count){
						s+=((page-1)*20+1)+"-"+((page)*20-1)+" of "+count;
					}else{
						s+=((page-1)*20+1)+"-"+(count)+" of "+count;
					}
				}
				
				if (page<count/20){
					if (el.parents(".groupsChooser").length!=0){
						el.find(".userPagination").append("<a class='nextGroupList' href='javascript:;'>next »</a>");
					}else{
						el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
					}
				}
				el.find("ul li").hide();
				for (var i=(page-1)*20;i<20*page;i++){
					el.find("ul li").eq(i).show();
				}
 
				pag.text(s);
			},
            nextUserList: function (e, page) {
				
				$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))+1);
				e.data.self.updateAssigneesPagination($(e.target).closest(".left"));

			},

            prevUserList: function (e, page) {
				$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))-1);
				e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },

            nextGroupList: function (e) {
				$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))+1);
				e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },

            prevGroupList: function (e) {
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

            unassign: function (e) {
                var id = $(e.target).closest("tr").data("id");
                var type = $(e.target).closest("tr").data("type");
                var text = $(e.target).closest("tr").find("td").eq(0).text();
                $("#" + type).append("<option value='" + id + "'>" + text + "</option>");
                $(e.target).closest("tr").remove();
                var groupsAndUser_holder = $(".groupsAndUser");
                if (groupsAndUser_holder.find("tr").length == 1) {
                    groupsAndUser_holder.hide();
                }

            },

            addUserToTable: function (id) {
                var groupsAndUser_holder = $(".groupsAndUser");
                var groupsAndUserTr_holder = $(".groupsAndUser tr");
                groupsAndUser_holder.show();
                groupsAndUserTr_holder.each(function () {
                    if ($(this).data("type") == id.replace("#", "")) {
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function () {
                    groupsAndUser_holder.append("<tr data-type='" + id.replace("#", "") + "' data-id='" + $(this).attr("id") + "'><td>" + $(this).text() + "</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length <2) {
                    groupsAndUser_holder.hide();
                }

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
                $("#targetUsers").unbind().on("click", "li", {self:this},this.removeUsers);
                $("#sourceUsers").unbind().on("click", "li", {self:this},this.addUsers);
                $(document).on("click", ".nextUserList",{self:this}, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevUserList",{self:this}, function (e) {
                    self.prevUserList(e);
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
                $("#targetGroups").unbind().on("click", "li", {self:this},this.removeUsers);
                $("#sourceGroups").unbind().on("click", "li", {self:this},this.addUsers);
                $(document).on("click", ".nextGroupList",{self:this}, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevGroupList",{self:this}, function (e) {
                    self.prevUserList(e);
                });

            },

            changeTab: function (e) {
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
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

            formSubmitHandler: function (event) {
                event.preventDefault();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;
                var customer = this.$el.find("#customerDd").data("id");
                var projectmanager = this.$el.find("#projectManagerDD").data("id");
                var projecttype = this.$el.find("#projectTypeDD").data("id");
                var workflow = this.$el.find("#workflowsDd").data("id");
                var description = $.trim(this.$el.find("#description").val());
                var $userNodes = this.$el.find("#usereditDd option:selected"), users = [];
                console.log(workflow);
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
                        name: val.innerHTML
                    });
                });
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
                var health = this.$el.find('#health a').data('value');
                var startDate = $.trim(this.$el.find("#StartDate").val());
                var targetEndDate = $.trim(this.$el.find("#EndDateTarget").val());
                this.model.save({
                    projectName: $.trim(this.$el.find("#projectName").val()),
                    projectShortDesc: $.trim(this.$el.find("#projectShortDesc").val()),
                    customer: customer ? customer : "",
                    projectmanager: projectmanager ? projectmanager : "",
                    workflow: workflow ? workflow : "",
                    projecttype: projecttype ? projecttype : "",
                    description: description,
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    health: health,
                    StartDate: startDate,
                    targetEndDate: targetEndDate
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        var currentModel = model.changed.result;
                        var currentModelID = currentModel["_id"];
                        var addFrmAttach = $("#createProjectForm");
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

                            var formURL = "http://" + window.location.host + "/uploadProjectsFiles";
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

                    error: function () {
                        self.hideDialog();
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
					closeOnEscape: false,
                    dialogClass: "edit-dialog",
                    width: "900",
                    title: "Create Project",
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: function () {
                                self.saveItem();
                            }
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
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, this.page, function(arr){
					console.log(arr);
				});
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/DepartmentsForDd", null, this.pageG);
                common.populateUsers("#allUsers", "/Users", null, null, true);

				populate.get("#projectTypeDD", "/projectType", {}, "name", this, true, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this, true);
                populate.get2name("#customerDd", "/Customer", {}, this, true, true);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", { id: "Projects" }, "name", this, true);

                $('#StartDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        //Setting minimum of endDate to picked startDate
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDateTarget').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
