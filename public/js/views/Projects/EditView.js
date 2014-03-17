define([
    "text!templates/Projects/EditTemplate.html",
    'views/Notes/NoteView',
    'views/Notes/AttachView',
    "custom",
    "common",
    "dataService",
	"populate"
],
    function (EditTemplate, noteView, attachView, custom, common, dataService, populate) {

        var EditView = Backbone.View.extend({
            contentType: "Projects",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem", "deleteItem");
                this.currentModel = options.model;
                this.currentModel.urlRoot = '/Projects/';
                this.page = 1;
                this.pageG = 1;
                this.responseObj = {};
                this.render();
                console.log(this.currentModel);
            },

            events: {
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers': 'addUsers',
                'click #removeUsers': 'removeUsers',
                "click #health a": "showHealthDd",
                "click #health ul li div": "chooseHealthDd",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect",
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
            hideNewSelect: function () {
                $(".newSelectList").hide();
                $("#health ul").hide();

            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            chooseHealthDd: function (e) {
                var target = $(e.target);
                target.parents("#health").find("a").attr("class", target.attr("class")).attr("data-value", target.attr("class").replace("health", "")).parent().find("ul").toggle();
            },
            showHealthDd: function (e) {
                $(e.target).parent().find("ul").toggle();
                return false;
            },
            updateAssigneesPagination: function (el) {
                var pag = el.find(".userPagination .text");
                el.find(".userPagination .nextUserList").remove();
                el.find(".userPagination .prevUserList").remove();
                el.find(".userPagination .nextGroupList").remove();
                el.find(".userPagination .prevGroupList").remove();

                var list = el.find("ul");
                var count = list.find("li").length;
                var s = "";
                var page = parseInt(list.attr("data-page"));
                if (page > 1) {
                    el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
                }
                if (count === 0) {
                    s += "0-0 of 0";
                } else {
                    if ((page) * 20 - 1 < count) {
                        s += ((page - 1) * 20 + 1) + "-" + ((page) * 20) + " of " + count;
                    } else {
                        s += ((page - 1) * 20 + 1) + "-" + (count) + " of " + count;
                    }
                }

                if (page < count / 20) {
                    el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
                }
                el.find("ul li").hide();
                for (var i = (page - 1) * 20; i < 20 * page; i++) {
                    el.find("ul li").eq(i).show();
                }

                pag.text(s);
            },


            nextUserList: function (e, page) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) + 1);
                e.data.self.updateAssigneesPagination($(e.target).closest(".left"));

            },

            prevUserList: function (e, page) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) - 1);
                e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },

            nextGroupList: function (e) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) + 1);
                e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },

            prevGroupList: function (e) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) - 1);
                e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },
            addUsers: function (e) {
                e.preventDefault();
                $(e.target).parents("ul").find("li:not(:visible)").eq(0).show();
                var div = $(e.target).parents(".left");
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));
                e.data.self.updateAssigneesPagination(div);
                div = $(e.target).parents(".left");
                e.data.self.updateAssigneesPagination(div);
            },

            removeUsers: function (e) {
                e.preventDefault();
                var div = $(e.target).parents(".left");
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
                e.data.self.updateAssigneesPagination(div);
                div = $(e.target).parents(".left");
                e.data.self.updateAssigneesPagination(div);

            },
            chooseUser: function (e) {
                $(e.target).toggleClass("choosen");
            },
            unassign: function (e) {
                var target = $(e.target);
                var id = target.closest("tr").data("id");
                var type = target.closest("tr").data("type");
                var text = target.closest("tr").find("td").eq(0).text();
                $("#" + type).append("<option value='" + id + "'>" + text + "</option>");
                target.closest("tr").remove();
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
                if ($(".groupsAndUser tr").length < 2) {
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
                this.updateAssigneesPagination($("#sourceUsers").closest(".left"));
                this.updateAssigneesPagination($("#targetUsers").closest(".left"));
                $("#targetUsers").on("click", "li", { self: this }, this.removeUsers);
                $("#sourceUsers").on("click", "li", { self: this }, this.addUsers);
                $(document).on("click", ".nextUserList", { self: this }, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevUserList", { self: this }, function (e) {
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
                this.updateAssigneesPagination($("#sourceGroups").closest(".left"));
                this.updateAssigneesPagination($("#targetGroups").closest(".left"));
                $("#targetGroups").on("click", "li", { self: this }, this.removeUsers);
                $("#sourceGroups").on("click", "li", { self: this }, this.addUsers);
                $(document).on("click", ".nextGroupList", { self: this }, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevGroupList", { self: this }, function (e) {
                    self.prevUserList(e);
                });
            },

            changeTab: function (e) {
                var target = $(e.target);
                target.closest(".dialog-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                var n = target.parents(".dialog-tabs").find("li").index(target.parent());
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

            hideDialog: function () {
                $('.edit-project-dialog').remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            saveItem: function (event) {
                event.preventDefault();
                var self = this;
                var viewType = custom.getCurrentVT();
                var mid = 39;
                var projectName = $.trim(this.$el.find("#projectName").val());
                var projectShortDesc = $.trim(this.$el.find("#projectShortDesc").val());
                var customer = this.$el.find("#customerDd").data("id");
                var projectmanager = this.$el.find("#projectManagerDD").data("id");
                var workflow = this.$el.find("#workflowsDd").data("id");
                var projecttype = this.$el.find("#projectTypeDD").data("id");
                var $userNodes = $("#usereditDd option:selected");
                var startDate = $.trim(this.$el.find("#StartDate").val());
                var users = [];
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
                var _targetEndDate = $.trim(this.$el.find("#EndDateTarget").val());
                var description = $.trim(this.$el.find("#description").val());
                var currentTargetEndDate = this.currentModel.get('TargetEndDate');
                var TargetEndDate = _targetEndDate || currentTargetEndDate;
                var data = {
                    projectName: projectName,
                    projectShortDesc: projectShortDesc,
                    customer: customer ? customer : null,
                    projectmanager: projectmanager ? projectmanager : null,
                    workflow: workflow ? workflow : null,
                    projecttype: projecttype ? projecttype : "",
                    description: description,
                    teams: {
                        users: users
                    },
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    health: health,
                    StartDate: startDate,
                    TargetEndDate: TargetEndDate
                };
                var workflowStart = this.currentModel.get('workflow');
                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    //wait: true,
                    success: function (model) {
                        $('.edit-project-dialog').remove();
                        $(".add-group-dialog").remove();
                        $(".add-user-dialog").remove();
                        if (viewType == "list") {
                            var tr_holder = $("tr[data-id='" + self.currentModel.toJSON()._id + "'] td");
                            $("a[data-id='" + self.currentModel.toJSON()._id + "']").text(projectName);
                            tr_holder.eq(2).text(projectName);
                            tr_holder.eq(3).text(self.$el.find("#customerDd").text());
                            tr_holder.eq(4).text(self.$el.find("#StartDate").val());
                            tr_holder.eq(5).text(self.$el.find("#EndDate").val());
                            tr_holder.eq(6).text(self.$el.find("#EndDateTarget").val());
                            if (new Date(self.$el.find("#EndDate").val()) < new Date(self.$el.find("#EndDateTarget").val())) {
                                tr_holder.eq(5).addClass("red-border");
                            } else {
                                tr_holder.eq(5).removeClass("red-border");
                            }
                            tr_holder.eq(8).find(".stageSelect").text(self.$el.find("#workflowsDd").text());
                            tr_holder.eq(9).find(".health-container a").attr("class", "health" + health).attr("data-value", health);
                            tr_holder.eq(11).text(model.toJSON().editedBy.date + " (" + model.toJSON().editedBy.user.login + ")");
                            if (data.workflow != workflowStart) {
                                Backbone.history.fragment = "";
                                Backbone.history.navigate(window.location.hash.replace("#", ""), { trigger: true });

                            }
                        } else {
                            var currentModel_holder = $("#" + self.currentModel.toJSON()._id);
                            currentModel_holder.find(".project-text span").eq(0).text(projectName);
                            currentModel_holder.find(".project-text span").eq(1).find("a").attr("class", "health" + health).attr("data-value", health);
                            if (customer)
                                $("#" + self.currentModel.toJSON()._id).find(".project-text span").eq(2).text(self.$el.find("#customerDd").text());
                            currentModel_holder.find(".bottom .stageSelect").text(self.$el.find("#workflowsDd").text()).attr("class", "stageSelect " + self.$el.find("#workflowsDd").text().toLowerCase().replace(" ", ''));
                            if (projectmanager)
                                common.getImagesPM([projectmanager], "/getEmployeesImages", "#" + self.currentModel.toJSON()._id);
                        }
                    },
                    error: function (model, xhr) {
    					self.errorNotification(xhr);
                    }

                });
            },

            deleteItem: function (event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                var answer = confirm("Realy DELETE items ?!");
                if (answer) {
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
                                case 'thumbnails':
                                    {
                                        $("#" + model._id).remove();
                                        $('.edit-project-dialog').remove();
                                        $(".add-group-dialog").remove();
                                        $(".add-user-dialog").remove();
                                    }
                            }
                            self.hideDialog();
                        },
                        error: function (model, xhr) {
    						self.errorNotification(xhr);
                        }
                    });
                }
            },

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: false,
                    title: "Edit Project",
                    dialogClass: "edit-project-dialog",
                    width: "900px",
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
                var notDiv = this.$el.find('#divForNote');
                notDiv.append(
                 new noteView({
                     model: this.currentModel
                 }).render().el);
                notDiv.append(
                    new attachView({
                        model: this.currentModel,
						url:"/uploadProjectsFiles"
                    }).render().el
                );

                common.populateUsersForGroups('#sourceUsers', '#targetUsers', this.currentModel.toJSON(), this.page);
                common.populateUsers("#allUsers", "/UsersForDd", this.currentModel.toJSON(), null, true);
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/DepartmentsForDd", this.currentModel.toJSON(), this.pageG);
                populate.get("#projectTypeDD", "/projectType", {}, "name", this, false, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
                populate.get2name("#customerDd", "/Customer", {}, this, false, true);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", { id: "Projects" }, "name", this);
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
                    changeYear: true,
                    minDate: (model.StartDate) ? model.StartDate : 0
                });
                this.delegateEvents(this.events);

                return this;
            }

        });

        return EditView;
    });
