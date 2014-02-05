define([
    "text!templates/Projects/EditTemplate.html",
    "custom",
    "common",
    "dataService",
    'text!templates/Notes/AddAttachments.html',
    'text!templates/Notes/AddNote.html',
	"populate"
],
    function (EditTemplate, custom, common, dataService, addAttachTemplate, addNoteTemplate, populate) {

        var EditView = Backbone.View.extend({
            contentType: "Projects",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem", "deleteItem");
                this.currentModel = options.model;
                this.currentModel.urlRoot = '/Projects/';
                this.page = 1;
                this.pageG = 1;
                this.responseObj = {}
                this.render();
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
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
                "click #addNote": "addNote",
                "click .editDelNote": "editDelNote",
                "click #cancelNote": "cancelNote",
                "click #noteArea": "expandNote",
                "click #cancelNote": "cancelNote",
                "click .addTitle": "showTitle",
                "click .editNote": "editNote",
                "click #health a": "showHealthDd",
                "click #health ul li div": "chooseHealthDd",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect",
                "click .current-selected": "showNewSelect",
            },
            notHide: function (e) {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();;
            },
            hideNewSelect: function (e) {
                $(".newSelectList").hide();
                $("#health ul").hide();

            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true)
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false)
            },
            chooseHealthDd: function (e) {
                $(e.target).parents("#health").find("a").attr("class", $(e.target).attr("class")).attr("data-value", $(e.target).attr("class").replace("health", "")).parent().find("ul").toggle();
            },
            showHealthDd: function (e) {
                $(e.target).parent().find("ul").toggle();
                return false;
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
                var currentModel = this.currentModel;
                var notes = currentModel.get('notes');

                switch (type) {
                    case "edit": {
                        $('#noteArea').val($('#' + id_int).find('.noteText').text());
                        $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                        $('#getNoteKey').attr("value", id_int);
                        break;
                    }
                    case "del": {
                        var newNotes = _.filter(notes, function (note) {
                            if (note._id != id_int) {
                                return note;
                            }
                        });
                        currentModel.save({ 'notes': newNotes },
                                {
                                    headers: {
                                        mid: 39
                                    },
                                    patch: true,
                                    success: function () {
                                        $('#' + id_int).remove();
                                    }
                                });
                        break;
                    }
                }
            },

            addNote: function (e) {
                e.preventDefault();
                var val = $('#noteArea').val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                var title = $('#noteTitleArea').val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                if (val || title) {
                    var notes = this.currentModel.get('notes');
                    var arrKeyStr = $('#getNoteKey').attr("value");
                    var noteObj = {
                        note: '',
                        title: ''
                    };
                    if (arrKeyStr) {
                        var editNotes = _.map(notes, function (note) {
                            if (note._id == arrKeyStr) {
                                note.note = val;
                                note.title = title;
                            }
                            return note;
                        });
                        this.currentModel.save({ 'notes': editNotes },
                            {
                                headers: {
                                    mid: 39
                                },
                                patch: true,
                                success: function () {
                                    $('#noteBody').val($('#' + arrKeyStr).find('.noteText').html(val));
                                    $('#noteBody').val($('#' + arrKeyStr).find('.noteTitle').html(title));
                                    $('#getNoteKey').attr("value", '');
                                }
                            });
                    } else {
                        noteObj.note = val;
                        noteObj.title = title;
                        notes.push(noteObj);
                        this.currentModel.set();
                        this.currentModel.save({ 'notes': notes },
                            {
                                headers: {
                                    mid: 39
                                },
                                patch: true,
                                success: function (models, data) {
                                    $('#noteBody').empty();
                                    data.notes.forEach(function (item) {
                                        var date = common.utcDateToLocaleDate(item.date);
                                        $('#noteBody').prepend(_.template(addNoteTemplate, { id: item._id, title: item.title, val: item.note, author: item.author, date: date }));
                                    });
                                }
                            });
                    }
                    $('#noteArea').val('');
                    $('#noteTitleArea').val('');
                }
            },

            editNote: function () {
                $(".title-wrapper").show();
                $("#noteArea").attr("placeholder", "").parents(".addNote").addClass("active");
            },

            expandNote: function (e) {
                if (!$(e.target).parents(".addNote").hasClass("active")) {
                    $(e.target).attr("placeholder", "").parents(".addNote").addClass("active");
                    $(".addTitle").show();
                }
            },

            cancelNote: function (e) {
                $(e.target).parents(".addNote").find("#noteArea").attr("placeholder", "Add a Note...").parents(".addNote").removeClass("active");
                $(".title-wrapper").hide();
                $(".addTitle").hide();
            },

            saveNote: function (e) {
                if (!($(e.target).parents(".addNote").find("#noteArea").val() == "" && $(e.target).parents(".addNote").find("#noteTitleArea").val() == "")) {
                    $(e.target).parents(".addNote").find("#noteArea").attr("placeholder", "Add a Note...").parents(".addNote").removeClass("active");
                    $(".title-wrapper").hide();
                    $(".addTitle").hide();
                }
                else {
                    $(e.target).parents(".addNote").find("#noteArea").focus();
                }
            },

            showTitle: function (e) {
                $(e.target).hide().parents(".addNote").find(".title-wrapper").show().find("input").focus();
            },


            fileSizeIsAcceptable: function (file) {
                if (!file) { return false; }
                return file.size < App.File.MAXSIZE;
            },

            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.currentModel;
                var currentModelID = currentModel["id"];
                var addFrmAttach = $("#editProjectForm");
                var addInptAttach = $(".input-file .inputAttach")[0].files[0];
                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    e.preventDefault();
                    var bar = $('.bar');
                    var status = $('.progress_status');
                    var formURL = "http://" + window.location.host + "/uploadProjectsFiles";
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

                            data.attachments.forEach(function (item) {
                                var date = common.utcDateToLocaleDate(item.uploadDate);
                                attachments.push(item);
                                $('.attachContainer').prepend(_.template(addAttachTemplate, { data: item, date: date }));
                            });
                            addFrmAttach[0].reset();
                            status.hide();
                        },

                        error: function (model, xhr) {
                            alert(xhr.status);
                        }
                    });
                })
                addFrmAttach.submit();
                addFrmAttach.off('submit');
            },

            deleteAttach: function (e) {
                var target = $(e.target);
                if (target.closest("li").hasClass("attachFile")) {
                    target.closest(".attachFile").remove();
                } else {
                    var id = e.target.id;
                    var currentModel = this.currentModel;
                    var attachments = currentModel.get('attachments');
                    var newAttachments = _.filter(attachments, function (attach) {
                        if (attach._id != id) {
                            return attach;
                        }
                    });
                    currentModel.save({ 'attachments': newAttachments },
                        {
                            headers: {
                                mid: 39
                            },
                            patch: true,//Send only changed attr(add Roma)
                            success: function () {
                                $('.attachFile_' + id).remove();
                            }
                        });
                }
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
                if ($(".groupsAndUser").find("tr").length == 1) {
                    $(".groupsAndUser").hide();
                }

            },
            addUserToTable: function (id) {
                $(".groupsAndUser").show();
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == id.replace("#", "")) {
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function () {
                    $(".groupsAndUser").append("<tr data-type='" + id.replace("#", "") + "' data-id='" + $(this).attr("id") + "'><td>" + $(this).text() + "</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length < 2) {
                    $(".groupsAndUser").hide();
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
                                click: self.addUserToTable("#targetUsers")
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
            addGroup: function (e) {
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons: {
                        save: {
                            text: "Choose",
                            class: "btn",
                            click: function () {
                                self.addUserToTable("#targetGroups")
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
                var self = this;
                $(document).unbind().on("click", ".nextGroupList", function (e) {
                    self.pageG += 1
                    self.nextUserList(e, self.pageG)
                });
                $(document).unbind().on("click", ".prevGroupList", function (e) {
                    self.pageG -= 1
                    self.prevUserList(e, self.pageG)
                });
            },

            changeTab: function (e) {
                var target = $(e.target);
                target.closest(".dialog-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                var n = target.parents(".dialog-tabs").find("li").index(target.parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
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
                Backbone.history.fragment = '';
                var viewType = custom.getCurrentVT();
                var mid = 39;
                var projectName = $.trim(this.$el.find("#projectName").val());
                var projectShortDesc = $.trim(this.$el.find("#projectShortDesc").val());
                var customer = this.$el.find("#customerDd").data("id");
                var projectmanager = this.$el.find("#projectManagerDD").data("id");
                var workflow = this.$el.find("#workflowsDd").data("id");
                var projecttype = this.$el.find("#projectTypeDD").data("id");
                var $userNodes = $("#usereditDd option:selected");
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
                var targetEndDate = $.trim(this.$el.find("#EndDateTarget").val());
                var info = this.currentModel.get('info');
                info['TargetEndDate'] = targetEndDate || info.TargetEndDate;
                var data = {
                    projectName: projectName,
                    projectShortDesc: projectShortDesc,
                    customer: customer ? customer : null,
                    projectmanager: projectmanager ? projectmanager : null,
                    workflow: workflow ? workflow : null,
                    projecttype: projecttype ? projecttype : "",
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
                    info: info
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
						$("#"+self.currentModel.toJSON()._id).find(".project-text span").eq(0).text(projectName);
						if (customer)
							$("#"+self.currentModel.toJSON()._id).find(".project-text span").eq(2).text(self.$el.find("#customerDd").text());
						$("#"+self.currentModel.toJSON()._id).find(".bottom .status").text(self.$el.find("#workflowsDd").text()).attr("class","status "+self.$el.find("#workflowsDd").text().toLowerCase().replace(" ",''));
						if (projectmanager)
							common.getImagesPM([projectmanager], "/getEmployeesImages", "#"+self.currentModel.toJSON()._id);
						// Backbone.history.navigate("#easyErp/Projects/" + viewType, { trigger: true });
                    },
                    error: function () {
                        $('.edit-project-dialog').remove();
                        Backbone.history.navigate("home", { trigger: true });
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
                this.$el = $(formString).dialog({
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
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', this.currentModel.toJSON(), this.page);
                common.populateUsers("#allUsers", "/UsersForDd", this.currentModel.toJSON(), null, true);
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/DepartmentsForDd", this.currentModel.toJSON(), this.pageG);
                populate.get("#projectTypeDD", "/projectType", {}, "name", this);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
                populate.get2name("#customerDd", "/Customer", {}, this);
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
                $('#EndDateTarget').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: new Date()
                });
                this.delegateEvents(this.events);

                return this;
            }

        });

        return EditView;
    });
