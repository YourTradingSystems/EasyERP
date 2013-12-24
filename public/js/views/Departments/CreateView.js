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
                this.render();
            },
			events:{
                'click .dialog-tabs a': 'changeTab',
                'click #sourceUsers li': 'chooseUser',
                'click #targetUsers li': 'chooseUser',
			    'click #addUsers':'addUsers',
			    'click #removeUsers':'removeUsers'
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
                $('#targetUsers').append($('#sourceUsers .choosen'));
            },
            removeUsers: function (e) {
                e.preventDefault();
                $('#sourceUsers').append($('#targetUsers .choosen'));
            },

            saveItem: function () {

                var self = this;

                var mid = 39;
                var departmentName = $.trim($("#departmentName").val());
                
                var parentDepartment = this.$("#parentDepartment option:selected").val();
                //var _parentDepartment = common.toObject(departmentId, this.departmentsCollection);
                var nestingLevel = this.$("#parentDepartment option:selected").data('level');
                var departmentManager = this.$("#departmentManager option:selected").val();
                var users = this.$el.find("#targetUsers .choosen");
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
                common.populateDepartments(App.ID.parentDepartment, "/getSalesTeam");
				common.populateEmployeesDd(App.ID.departmentManager, "/getPersonsForDd");
				common.populateUsersForGroups('#sourceUsers');
                return this;
            }

        });

        return CreateView;
    });
