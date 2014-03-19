define([
    'text!templates/Assignees/AssigneesTemplate.html',
    'common'

], function (assigneesTemplate, common) {
    var AssigneesView = Backbone.View.extend({

        initialize: function(options) {
			this.model = options.model;
        },
        events: {
            'click .addUser': 'addUser',
            'click .addGroup': 'addGroup',
            'click .unassign': 'unassign',
            "click .prevUserList": "prevUserList",
            "click .nextUserList": "nextUserList",
        },

        template: _.template(assigneesTemplate),
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
			$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))+1);
			e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
        },

        prevUserList: function (e, page) {
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
   		updateAssigneesPagination:function(el){
			var pag = el.find(".userPagination .text");
			el.find(".userPagination .nextUserList").remove();
			el.find(".userPagination .prevUserList").remove();
			el.find(".userPagination .nextGroupList").remove();
			el.find(".userPagination .prevGroupList").remove();

			var list = el.find("ul");
			var count = list.find("li").length;
			var s ="";
			if (!list.attr("data-page")){
				list.attr("data-page",1);
			}
			var page  = parseInt(list.attr("data-page"));
			if (page>1){
				el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
			}
			if (count===0){
				s+="0-0 of 0";
			}else{
				if ((page)*20-1<count){
					s+=((page-1)*20+1)+"-"+((page)*20)+" of "+count;
				}else{
					s+=((page-1)*20+1)+"-"+(count)+" of "+count;
				}
			}
			
			if (page<count/20){
				el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
			}
			el.find("ul li").hide();
			for (var i=(page-1)*20;i<20*page;i++){
				el.find("ul li").eq(i).show();
			}
			
			pag.text(s);
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
            $("#targetUsers").on("click", "li", {self:this},this.removeUsers);
            $("#sourceUsers").on("click", "li", {self:this},this.addUsers);
            $(document).on("click", ".nextUserList",{self:this}, function (e) {
                self.nextUserList(e);
            });
            $(document).on("click", ".prevUserList",{self:this}, function (e) {
                self.prevUserList(e);
            });
        },
		addUserToTable: function (id) {
            var groupsAndUser = $(".groupsAndUser");
            var groupsAndUserTr = $(".groupsAndUser tr");
            groupsAndUser.show();
            groupsAndUserTr.each(function () {
                if ($(this).data("type") == id.replace("#", "")) {
                    $(this).remove();
                }
            });
            $(id).find("li").each(function () {
                groupsAndUser.append("<tr data-type='" + id.replace("#", "") + "' data-id='" + $(this).attr("id") + "'><td>" + $(this).text() + "</td><td class='text-right'></td></tr>");
            });
            if ($(".groupsAndUser tr").length <2) {
                groupsAndUser.hide();
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
			this.updateAssigneesPagination($("#sourceGroups").closest(".left"));
			this.updateAssigneesPagination($("#targetGroups").closest(".left"));
            $("#targetGroups").on("click", "li", {self:this},this.removeUsers);
            $("#sourceGroups").on("click", "li", {self:this},this.addUsers);
            $(document).on("click", ".nextUserList",{self:this}, function (e) {
                self.nextUserList(e);
            });
            $(document).on("click", ".prevUserList",{self:this}, function (e) {
                self.prevUserList(e);
            });
        },
        render: function () {
            this.$el.html(this.template({}));
			if (this.model){
				common.populateUsersForGroups( this.$el.find('#sourceUsers'), this.$el.find('#targetUsers'),this.model.toJSON(),1);
                common.populateUsers( this.$el.find("#allUsers"), "/UsersForDd",this.model.toJSON(),null,true);
                common.populateDepartmentsList( this.$el.find("#sourceGroups"), this.$el.find("#targetGroups"), "/DepartmentsForDd",this.model.toJSON(),1);
			}else{
				common.populateUsersForGroups( this.$el.find('#sourceUsers'), this.$el.find('#targetUsers'), null, 1);
				common.populateUsers(this.$el.find("#allUsers"), "/UsersForDd", null, null, true);
				common.populateDepartmentsList(this.$el.find("#sourceGroups"), this.$el.find("#targetGroups"), "/DepartmentsForDd", null, 1);
			}
            return this;
        }
    });

    return AssigneesView;
});
