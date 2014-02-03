define([
    "text!templates/Departments/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "models/DepartmentsModel",
    "common",
    "custom",
	"populate"
],
    function (CreateTemplate, DepartmentsCollection, AccountsDdCollection, DepartmentsModel, common, Custom, populate) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.departmentsCollection = new DepartmentsCollection();
                this.model = new DepartmentsModel();
				this.page = 1;
				this.responseObj = {}
                this.render();
            },
			events:{
                'click .dialog-tabs a': 'changeTab',
			    'click #sourceUsers li':'addUsers',
			    'click #targetUsers li':'removeUsers',
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
				"click .prevUserList":"prevUserList",
				"click .nextUserList":"nextUserList",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
			},
            notHide: function (e) {
				return false;
            },

			nextSelect:function(e){
				this.showNewSelect(e,false,true)
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false)
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
                
                var parentDepartment = this.$("#parentDepartment").data("id");
                //var _parentDepartment = common.toObject(departmentId, this.departmentsCollection);
                var nestingLevel = this.$("#parentDepartment").data('level');
                var departmentManager = this.$("#departmentManager").data("id");
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
				$(".newSelectList").hide();;
			},
	        showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
                
            },


			chooseOption:function(e){
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id")).attr("data-level",$(e.target).data("level"));
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
/*                common.populateDepartments(App.ID.parentDepartment, "/getSalesTeam",null,function(){self.styleSelect(App.ID.parentDepartment);});
				common.populateEmployeesDd(App.ID.departmentManager, "/getPersonsForDd",null,function(){self.styleSelect(App.ID.departmentManager);});*/
				populate.get2name("#departmentManager", "/getPersonsForDd",{},this,true,true);
				populate.getParrentDepartment("#parentDepartment", "/getSalesTeam",{},this,true,true);

				common.populateUsersForGroups('#sourceUsers','#targetUsers',null,this.page);
                return this;
            }

        });

        return CreateView;
    });
