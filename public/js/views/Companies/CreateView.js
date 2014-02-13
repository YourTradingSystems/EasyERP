define([
    "text!templates/Companies/CreateTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "models/CompaniesModel",
    "common"
],
    function (CreateTemplate, CompaniesCollection, EmployeesCollection, DepartmentsCollection, CompanyModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new CompanyModel();
                this.page=1;
                this.pageG=1;
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
                "click .nextUserList":"nextUserList"
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
                $("#targetUsers").unbind().on("click","li",this.removeUsers);
                $("#sourceUsers").unbind().on("click","li",this.addUsers);
                $(".nextUserList").unbind().on("click",function(e){
                    self.page += 1;
                    self.nextUserList(e,self.page);
                });
                $(".prevUserList").unbind().on("click",function(e){
                    self.page -= 1;
                    self.prevUserList(e,self.page);
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
                if (groupsAndUserHr_holder.length<2){
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
                $("#targetGroups").unbind().on("click","li",this.removeUsers);
                $("#sourceGroups").unbind().on("click","li",this.addUsers);
                $(".nextGroupList").unbind().on("click",function(e){
                    self.pageG += 1;
                    self.nextUserList(e,self.pageG);
                });
                $(".prevGroupList").unbind().on("click",function(e){
                    self.pageG -= 1;
                    self.prevUserList(e,self.pageG);
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

            nextUserList:function(e,page){
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,page);
            },

            prevUserList:function(e,page){
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,page);
            },

            addUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));

            },

            removeUsers: function (e) {
                e.preventDefault();
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
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

                var website = $.trim(this.$el.find("#website").val());

                var internalNotes = $.trim(this.$el.find("#internalNotes").val());

                var salesPerson = this.$("#employeesDd option:selected").val();
                //var salesPerson = common.toObject(salesPersonId, this.employeesCollection);

                var salesTeam = this.$("#departmentDd option:selected").val();
                //var salesTeam = common.toObject(salesTeamId, this.departmentsCollection);

                var reference = $.trim(this.$el.find("#reference").val());

                var language = $.trim(this.$el.find("#language").val());

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
                            self.hideDialog();
                            (xhr.status == 401) ? Backbone.history.navigate('#login', { trigger: true }):
                                Backbone.history.navigate("home", { trigger: true });
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
					dialogClass:"edit-dialog",
					title: "Edit Company",
					width:"80%",
                    buttons: [
                        {
                            text: "Create",
                            click: function () { self.saveItem(); }
                        },

						{
							text: "Cancel",
							click: function () { $(this).dialog().remove(); }
						}]

                });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
                common.populateUsers("#allUsers", "/UsersForDd",null,null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",null,this.pageG);

                common.populateDepartments("#departmentDd", "/DepartmentsForDd");
                common.populateEmployeesDd("#employeesDd", "/getSalesPerson");
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
