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

            nextUserList: function (e, page) {
				var n = $(e.target).closest(".ui-dialog").find(".source li:visible").length;
				var p = $(e.target).closest(".ui-dialog").find(".source li:visible").eq(n-1).next();
				$(e.target).closest(".ui-dialog").find(".source li").hide();
				$(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
				var k=0;
				for (var i=0;i<20;i++){
					if (p&&p.get(0)&&p.get(0).tagName=="LI"){
						k++;
						p.show();
						p = p.next();
					}
				}
				$(".userPagination .text").text((n+1)+"-"+(n+k)+" of "+$(e.target).closest(".ui-dialog").find(".source li").length);
            },

            prevUserList: function (e, page) {
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, page);
            },

            nextGroupList: function () {
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/Departments", null, this.pageG, null);
            },

            prevGroupList: function () {
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/Departments", null, this.pageG, null);
            },

            addUsers: function (e) {
                e.preventDefault();
				$(e.target).parents("ul").find("li:not(:visible)").eq(0).show();
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));
				var s = "";
				var k = $(e.target).closest(".ui-dialog").find(".userPagination .text").text().split(" ")[0];
				if ($(e.target).closest(".ui-dialog").find(".source li").length===0){
					s+="0";
				}else{
					s+=k.split("-")[0];
				}
				s+="-";
				var p = 0;
				if (parseInt(k.split("-")[1])<=$(e.target).closest(".ui-dialog").find(".source li").length){
					s+=parseInt(k.split("-")[1]);
					p = parseInt($(e.target).closest(".ui-dialog").find(".userPagination .text").text().split(" ")[2])-1;
					$(e.target).closest(".ui-dialog").find(".userPagination .nextUserList").show();
				}else{
					s+=parseInt(k.split("-")[1])-1;
					p = parseInt($(e.target).closest(".ui-dialog").find(".userPagination .text").text().split(" ")[2])-1;
					$(e.target).closest(".ui-dialog").find(".userPagination .nextUserList").hide();
				}
				s+=" of "+($(e.target).closest(".ui-dialog").find(".source li").length);
				console.log($(e.target).attr("id"));
				$(e.target).closest(".ui-dialog").find(".source").next(".userPagination").find(".text").text(s);
            },

            removeUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
				var s = "";
				var k = $(e.target).closest(".ui-dialog").find(".userPagination .text").text().split(" ")[0];
				s+=k.split("-")[0];
				s+="-";
				$(e.target).closest(".ui-dialog").find(".userPagination .text").text(s);
				var p = 0;
				if (parseInt(k.split("-")[1])<parseInt($(e.target).closest(".ui-dialog").find(".userPagination .text").text().split(" ")[2])){
					s+=parseInt(k.split("-")[1]);
					p = parseInt($(e.target).closest(".ui-dialog").find(".userPagination .text").text().split(" ")[2])-1;
					$(e.target).closest(".ui-dialog").find(".userPagination .nextUserList").show();
				}else{
					s+=parseInt(k.split("-")[1])-1;
					p = parseInt($(e.target).closest(".ui-dialog").find(".userPagination .text").text().split(" ")[2])-1;
					$(e.target).closest(".ui-dialog").find(".userPagination .nextUserList").hide();
				}
				s+=" of "+p;

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
                    changeYear: true
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
