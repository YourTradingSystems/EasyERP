define([
    "text!templates/Companies/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Persons/PersonsCollection",
    "collections/Departments/DepartmentsCollection",
    "common",
	"populate"
],
    function (EditTemplate, CompaniesCollection, EmployeesCollection, PersonsCollection, DepartmentsCollection, common, populate) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Companies",
            imageSrc: '',

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.page=1;
                this.pageG=1;
				this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click #contacts": "editContacts",
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
                "click .details": "toggleDetails",

                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers':'addUsers',
                'click #removeUsers':'removeUsers',
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
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
            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n= holder.parents(".dialog-tabs").find("li").index(holder.parent());
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
                $(document).on("click",".nextUserList",function(e){
                    self.page += 1;
                    self.nextUserList(e,self.page);
                });
                $(document).on("click",".prevUserList",function(e){
                    self.page -= 1;
                    self.prevUserList(e,self.page);
                });

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
                $(document).unbind().on("click",".nextGroupList",function(e){
                    self.pageG += 1;
                    self.nextUserList(e,self.pageG);
                });
                $(document).unbind().on("click",".prevGroupList",function(e){
                    self.pageG -= 1;
                    self.prevUserList(e,self.pageG);
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

            chooseUser:function(e){
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
			toggleDetails:function(){
				$("#details-dialog").toggle();
			},
            hideDialog: function () {
                $(".edit-companies-dialog").remove();
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
            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            editContacts: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },
            saveItem: function (event) {
                if(event) event.preventDefault();
                var mid = 39;

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

                var data = {
                    name: {
                        first: this.$el.find("#name").val(),
                        last: ''
                    },
                    imageSrc: this.imageSrc,
                    email: this.$el.find("#email").val(),
                    phones: {
                        phone: this.$el.find("#phone").val(),
                        mobile: this.$el.find("#mobile").val(),
                        fax: this.$el.find("#fax").val()
                    },
                    address: {
                        street: this.$el.find('#street').val(),
                        city: this.$el.find('#city').val(),
                        state: this.$el.find('#state').val(),
                        zip: this.$el.find('#zip').val(),
                        country: this.$el.find('#country').val()
                    },
                    website: this.$el.find('#website').val(),
                    internalNotes: $.trim(this.$el.find("#internalNotes").val()),

                    salesPurchases: {
                        isCustomer: this.$el.find("#isCustomer").is(":checked"),
                        isSupplier: this.$el.find("#isSupplier").is(":checked"),
                        active: this.$el.find("#active").is(":checked"),
                        salesPerson: this.$el.find('#employeesDd').data("id")===""?null:this.$el.find('#employeesDd').data("id"),
                        salesTeam: this.$el.find("#departmentDd").data("id")===""?null:this.$el.find("#departmentDd").data("id"),
                        reference: this.$el.find("#reference").val(),
                        language: this.$el.find("#language").text()
                    },
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                };
                

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        $(".edit-companies-dialog").remove();
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Companies/form/" + model.id, { trigger: true });
                    },
                    error: function (model, xhr) {
						if (xhr && (xhr.status === 401||xhr.status === 403)) {
							if (xhr.status === 401){
								Backbone.history.navigate("login", { trigger: true });
							}else{
								alert("You do not have permission to perform this action");								
							}
                        } else {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    }

                });
            },

            template: _.template(EditTemplate),
            
            deleteItem: function(event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                    var answer = confirm("Realy DELETE items ?!");
                    if (answer == true) {
                        this.currentModel.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                $('.edit-companies-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function (models, err) {
								if (err.status===403){
									alert("You do not have permission to perform this action");
								}
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
                    dialogClass: "edit-dialog",
                    width: "80%",
                    //height: 513,
                    title: 'Edit Company',
                    buttons: [
                        {
                            text: "Save",
                            click: function () { self.saveItem(); }
                        },{
                        text: "Cancel",
                        click: function () { $(this).dialog().remove(); }
                    },
                    {
                        text: "Delete",
                        class: "btn",
                        click: self.deleteItem
                    }],
                    //closeOnEscape: false,
                    modal: true
                });
				$('#text').datepicker({ dateFormat: "d M, yy" });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);

				populate.get("#departmentDd", "/DepartmentsForDd",{},"departmentName",this);
				populate.get("#language", "/Languages",{},"name",this);
				populate.get2name("#employeesDd", "/getSalesPerson",{},this);
				/*
                common.populateDepartments("#departmentDd", "/DepartmentsForDd", this.currentModel.toJSON(), function () { self.styleSelect("#departmentDd"); });
			    common.populateEmployeesDd("#employeesDd", "/getSalesPerson", this.currentModel.toJSON(), function () { self.styleSelect("#employeesDd"); });
			    this.styleSelect('#language');*/
				
				this.delegateEvents(this.events);
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                var model = this.currentModel.toJSON();
                if (model.groups)
                    if (model.groups.users.length>0||model.groups.group.length){
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='"+ item._id+"'><td>"+item.departmentName+"</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='"+item._id+"'>"+item.departmentName+"</li>");
                        });
                        model.groups.users.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='"+ item._id+"'><td>"+item.login+"</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='"+item._id+"'>"+item.login+"</li>");
                        });

                    }
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });
