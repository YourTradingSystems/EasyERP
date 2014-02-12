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

            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new ProjectModel();
                this.page = 1;
                this.pageG = 1;
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
                "click": "hideHealth"

            },

            hideHealth: function () {
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
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, page);
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
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));

            },

            removeUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
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
                if (groupsAndUserTr_holder.length < 2) {
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
                var customer = this.$el.find("#customerDd option:selected").val();
                var projectmanager = this.$el.find("#projectManagerDD option:selected").val();
                var projecttype = this.$el.find("#projectTypeDD option:selected").val();
                var workflow = this.$el.find("#workflowsDd option:selected").data("id");
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
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, this.page);
                common.populateEmployeesDd("#projectManagerDD", "/getPersonsForDd");
                common.populateCustomers("#customerDd", "/Customer");
                common.populateUsers("#allUsers", "/Users", null, null, true);
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/DepartmentsForDd", null, this.pageG);
                common.populateEmployeesDd("#userEditDd", "/getPersonsForDd");
                common.populateWorkflows("Projects", "#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd");

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
