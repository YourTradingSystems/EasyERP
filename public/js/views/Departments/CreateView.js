define([
    "text!templates/Departments/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "models/DepartmentsModel",
    "common",
    "custom"
],
    function (CreateTemplate, DepartmentsCollection, AccountsDdCollection, DepartmentsModel, common, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.departmentsCollection = new DepartmentsCollection();
                this.model = new DepartmentsModel();
				this.page = 1;
                this.render();
            },
			events:{
                'click .dialog-tabs a': 'changeTab',
			    'click #sourceUsers li':'addUsers',
			    'click #targetUsers li':'removeUsers',
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
				"click .prevUserList":"prevUserList",
				"click .nextUserList":"nextUserList"
			},
			nextUserList:function(e){
				this.page+=1;
				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
			},
			prevUserList:function(e){
				this.page-=1;
				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
			},

			chooseUser:function(e){
				$(e.target).toggleClass("choosen");
			},
			changeTab:function(e){
				$(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
				$(e.target).addClass("active");
				var n= $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
				$(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
				$(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
			},

            close: function () {
                this._modelBinder.unbind();
            },
            addUsers: function (e) {
                e.preventDefault();
                $('#targetUsers').append($(e.target));
            },
            removeUsers: function (e) {
                e.preventDefault();
                $('#sourceUsers').append($(e.target));
            },

            saveItem: function () {

                var self = this;

                var mid = 39;
                var departmentName = $.trim($("#departmentName").val());
                
                var parentDepartment = this.$("#parentDepartment option:selected").val();
                //var _parentDepartment = common.toObject(departmentId, this.departmentsCollection);
                var nestingLevel = this.$("#parentDepartment option:selected").data('level');
                var departmentManager = this.$("#departmentManager option:selected").val();
                var users = this.$el.find("#targetUsers li");
                users = _.map(users, function(elm) {
                    return $(elm).attr('id');
                });
                this.model.save({
                    departmentName: departmentName,
                    parentDepartment: parentDepartment,
                    departmentManager: departmentManager,
                    nestingLevel: ++nestingLevel,
                    users: users
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						self.hideDialog();
                        Backbone.history.navigate("easyErp/Departments", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },
            hideDialog: function () {
                $(".create-dialog").remove();
            },
			hideNewSelect:function(e){
				$(".newSelectList").remove();;
			},
			showNewSelect:function(e){
				if ($(".newSelectList").length){
					this.hideNewSelect();
					return false;
				}else{
					var s="<ul class='newSelectList'>";
					$(e.target).parent().find("select option").each(function(){
						s+="<li class="+$(this).text().toLowerCase()+">"+$(this).text()+"</li>";
					});
					s+="</ul>";
					$(e.target).parent().append(s);
					return false;
				}
				
			},
			chooseOption:function(e){
				var k = $(e.target).parent().find("li").index($(e.target));
				$(e.target).parents("dd").find("select option:selected").removeAttr("selected");
				$(e.target).parents("dd").find("select option").eq(k).attr("selected","selected");
				$(e.target).parents("dd").find(".current-selected").text($(e.target).text());
			},

			styleSelect:function(id){
				var text = $(id).find("option:selected").length==0?$(id).find("option").eq(0).text():$(id).find("option:selected").text();
				if (text){
					$(id).parent().append("<a class='current-selected' href='javascript:;'>"+text+"</a>");
				}else{
					$(id).parent().append("<a class='current-selected' href='javascript:;'>Empty</a>");		
				}
				$(id).hide();
			},

            render: function () {
				var self = this;
                var formString = this.template({});

                   this.$el = $(formString).dialog({
                    autoOpen:true,
                    resizable:true,
					dialogClass:"create-dialog",
					title: "Edit department",
					width:"950px",
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
                common.populateDepartments(App.ID.parentDepartment, "/getSalesTeam",null,function(){self.styleSelect(App.ID.parentDepartment);});
				common.populateEmployeesDd(App.ID.departmentManager, "/getPersonsForDd",null,function(){self.styleSelect(App.ID.departmentManager);});
				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
                return this;
            }

        });

        return CreateView;
    });
