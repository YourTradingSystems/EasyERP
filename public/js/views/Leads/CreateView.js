define([
    "text!templates/Leads/CreateTemplate.html",
    "models/LeadsModel",
    "common",
    "populate"
],
    function (CreateTemplate, LeadModel, common, populate) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(CreateTemplate),

            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new LeadModel();
                this.page = 1;
                this.pageG = 1;
                this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                "click .prevUserList": "prevUserList",
                "click .nextUserList": "nextUserList",
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
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
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

            changeTab: function (e) {
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
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
                $(".nextUserList").unbind().on("click", function (e) {
                    self.page += 1;
                    self.nextUserList(e, self.page);
                });
                $(".prevUserList").unbind().on("click", function (e) {
                    self.page -= 1;
                    self.prevUserList(e, self.page);
                });
            },

            addUserToTable: function (id) {
                var groupsAndUser_holder = $(".groupsAndUser");
                var groupsAndUserHr_holder = $(".groupsAndUser tr");
                groupsAndUser_holder.show();
                groupsAndUserHr_holder.each(function () {
                    if ($(this).data("type") == id.replace("#", "")) {
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function () {
                    groupsAndUser_holder.append("<tr data-type='" + id.replace("#", "") + "' data-id='" + $(this).attr("id") + "'><td>" + $(this).text() + "</td><td class='text-right'></td></tr>");
                });
                if (groupsAndUserHr_holder.length < 2) {
                    groupsAndUser_holder.hide();
                }
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
                $(".nextGroupList").unbind().on("click", function (e) {
                    self.pageG += 1;
                    self.nextUserList(e, self.pageG);
                });
                $(".prevGroupList").unbind().on("click", function (e) {
                    self.pageG -= 1;
                    self.prevUserList(e, self.pageG);
                });

            },

            unassign: function (e) {
                var holder = $(e.target);
                var id = holder.closest("tr").data("id");
                var type = holder.closest("tr").data("type");
                var text = holder.closest("tr").find("td").eq(0).text();
                $("#" + type).append("<option value='" + id + "'>" + text + "</option>");
                holder.closest("tr").remove();
                var groupsAndUser_holder = $(".groupsAndUser");
                if (groupsAndUser_holder.find("tr").length == 1) {
                    groupsAndUser_holder.hide();
                }
            },

            nextUserList: function (e, page) {
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, page);
            },

            prevUserList: function (e, page) {
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, page);
            },

            addUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));

            },

            removeUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                //$("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
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

            saveItem: function () {
                var self = this;
                var $company = this.$("#company");
                var mid = 39;
                var name = $.trim(this.$el.find("#name").val());
                var company = {
                    name: $company.val(),
                    id: $company.data('id')
                };
                var idCustomer = this.$("#customerDd").data("id");
                var address = {};
                $("dd").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var salesPersonId = this.$("#salesPerson").data("id");
                var salesTeamId = this.$("#salesTeam option:selected").val();
                var first = $.trim(this.$el.find("#first").val());
                var last = $.trim(this.$el.find("#last").val());
                var contactName = {
                    first: first,
                    last: last
                };
                var email = $.trim(this.$el.find("#e-mail").val());
                var func = $.trim(this.$el.find("#func").val());

                var phone = $.trim(this.$el.find("#phone").val());
                var mobile = $.trim(this.$el.find("#mobile").val());
                var fax = $.trim(this.$el.find("#fax").val());
                var phones = {
                    phone: phone,
                    mobile: mobile,
                    fax: fax
                };
                var workflow = this.$("#workflowsDd").data('id');
                var priority = $("#priorityDd").data("id");
                var internalNotes = $.trim(this.$el.find("#internalNotes").val());
                var active = (this.$el.find("#active").is(":checked")) ? true : false;
                var optout = (this.$el.find("#optout").is(":checked")) ? true : false;
                var reffered = $.trim(this.$el.find("#reffered").val());

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
                this.model.save({
                        name: name,
                        company: company,
                        campaign: $('#campaignDd').data("id"),
                        source: $('#sourceDd').data("id"),
                        customer: idCustomer,
                        address: address,
                        salesPerson: salesPersonId,
                        salesTeam: salesTeamId,
                        contactName: contactName,
                        email: email,
                        func: func,
                        phones: phones,
                        fax: fax,
                        priority: priority,
                        internalNotes: internalNotes,
                        active: active,
                        optout: optout,
                        reffered: reffered,
                        workflow: workflow,
                        groups: {
                            owner: $("#allUsers").val(),
                            users: usersId,
                            group: groupsId
                        },
                        whoCanRW: whoCanRW
                    },
                    {
                        headers: {
                            mid: mid
                        },

                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/Leads", { trigger: true });
                        },
                        error: function (model, xhr) {
                            self.hideDialog();
                            if (xhr && xhr.status === 401) {
                                Backbone.history.navigate("login", { trigger: true });
                            } else {
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        }
                    });


            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            render: function () {
                var self = this;
                var formString = this.template();
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Edit Company",
                    width: "800",
                    buttons: [
                        {
                            text: "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },

                        {
                            text: "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    ]

                });
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, this.page);
                common.populateUsers("#allUsers", "/UsersForDd", null, null, true);
                common.populateDepartmentsList("#sourceGroups", "#targetGroups", "/DepartmentsForDd", null, this.pageG);

                populate.getPriority("#priorityDd", this, true);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", {id: "Leads"}, "name", this, true);
                populate.get2name("#customerDd", "/Customer", {}, this, true, true);
                populate.get("#sourceDd", "/sources", {}, "name", this, true, true);
                populate.get("#campaignDd", "/Campaigns", {}, "name", this, true, true);
                populate.get2name("#salesPerson", "/getForDdByRelatedUser", {}, this, true, true);
                this.delegateEvents(this.events);
                return this;
            }

        });
        return CreateView;
    });
