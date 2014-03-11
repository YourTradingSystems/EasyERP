define([
    "text!templates/Companies/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "models/CompaniesModel",
    "common",
	"populate"
],
    function (CreateTemplate, CompaniesCollection, EmployeesCollection, DepartmentsCollection, CompanyModel, common, populate) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new CompanyModel();
				this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .details": "toggleDetails",

                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                "click .prevUserList":"prevUserList",
                "click .nextUserList":"nextUserList",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect"

            },
			notHide: function () {
				return false;
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
			nextSelect:function(e){
				this.showNewSelect(e,false,true);
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false);
			},
            showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
            },
			chooseOption:function(e){
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
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

            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            addUser:function(){
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",

                            click: function(){
                                self.addUserToTable("#targetUsers");
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

            addUserToTable:function(id) {
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
                if ($(".groupsAndUser tr").length <2) {
                    groupsAndUser_holder.hide();
                }
            },

            addGroup:function(){
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",
                            click: function(){
                                self.addUserToTable("#targetGroups");
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

            unassign:function(e){
                var holder = $(e.target);
                var id = holder.closest("tr").data("id");
                var type = holder.closest("tr").data("type");
                var text = holder.closest("tr").find("td").eq(0).text();
                $("#"+type).append("<option value='"+id+"'>"+text+"</option>");
                holder.closest("tr").remove();
                var groupsAndUser_holder = $(".groupsAndUser");
                if (groupsAndUser_holder.find("tr").length==1){
                    groupsAndUser_holder.hide();
                }
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

			toggleDetails:function(){
				$("#details-dialog").toggle();
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
            hideDialog: function () {
                $(".create-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var companyModel = new CompanyModel();

                var name = {
                    first: $.trim(this.$el.find("#name").val()),
                    last:''
                };

                var address = {};
                this.$el.find(".person-info").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var email = $.trim(this.$el.find("#email").val());

                var phone = $.trim(this.$el.find("#phone").val());

                var mobile = $.trim(this.$el.find("#mobile").val());

                var fax = $.trim(this.$el.find("#fax").val());

                var website = $.trim(this.$el.find("#website").val().replace('http://', ''));
                
                var internalNotes = $.trim(this.$el.find("#internalNotes").val());

                var salesPerson = this.$("#employeesDd").data("id");

                var salesTeam = this.$("#departmentDd").data("id");

                var reference = $.trim(this.$el.find("#reference").val());

                var language = $.trim(this.$el.find("#language").text());

                var isCustomer = (this.$el.find("#isCustomer").is(":checked")) ? true : false;

                var isSupplier = (this.$el.find("#isSupplier").is(":checked")) ? true : false;

                var active = (this.$el.find("#active").is(":checked")) ? true : false;

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
                companyModel.save({
                    name: name,
                    imageSrc: this.imageSrc,
                    email: email,
                    phones: {
                        phone: phone,
                        mobile: mobile,
                        fax: fax
                    },
                    address: address,
                    website: website,
                    internalNotes: internalNotes,
                    salesPurchases: {
                        isCustomer: isCustomer,
                        isSupplier: isSupplier,
                        active: active,
                        salesPerson: salesPerson,
                        salesTeam: salesTeam,
                        reference: reference,
                        language: language
                    },
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
                        wait: true,
                        success: function () {
							self.hideDialog();
							Backbone.history.navigate("easyErp/Companies", { trigger: true });
                        },
                        error: function (models, xhr) {
							self.errorNotification(xhr);
						}
                    });

            },

            render: function () {
                var companyModel = new CompanyModel();
                var formString = this.template({});
				var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    autoOpen:true,
                    resizable:true,
					dialogClass:"create-dialog",
					title: "Create Company",
					width:"80%",
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
						}]

                });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,1);
                common.populateUsers("#allUsers", "/UsersForDd",null,null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",null,1);

				populate.get("#departmentDd", "/DepartmentsForDd",{},"departmentName",this,true,true);
				populate.get("#language", "/Languages",{},"name",this,true,false);
				populate.get2name("#employeesDd", "/getSalesPerson",{},this,true,true);
                common.canvasDraw({ model: companyModel.toJSON() }, this);
                this.$el.find('#date').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
