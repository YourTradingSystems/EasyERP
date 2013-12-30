define([
    "text!templates/Departments/EditTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "common",
    "custom"
],
    function (EditTemplate, DepartmentsCollection, AccountsDdCollection, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                this.departmentsCollection = new DepartmentsCollection();
                _.bindAll(this, "render", "deleteItem");
				if (options.myModel){
					this.currentModel = options.myModel
				}
				else{
					this.currentModel = (options.model) ? options.model : options.collection.getElement();
				}
                this.render();
            },
			events:{
                'click .dialog-tabs a': 'changeTab',
                'click #sourceUsers li': 'chooseUser',
                'click #targetUsers li': 'chooseUser',
			    'click #addUsers':'addUsers',
			    'click #removeUsers':'removeUsers',
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect"
			},
			chooseUser:function(e){
				$(e.target).toggleClass("choosen");
			},
            addUsers: function (e) {
                e.preventDefault();
                $('#targetUsers').append($('#sourceUsers .choosen'));
            },
            removeUsers: function (e) {
                e.preventDefault();
                $('#sourceUsers').append($('#targetUsers .choosen'));
            },

			changeTab:function(e){
				$(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
				$(e.target).addClass("active");
				var n= $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
				$(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
				$(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
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

            saveItem: function () {

                var self = this;
                var mid = 39;
                var departmentName = $.trim($("#departmentName").val());
                
                var parentDepartment = this.$("#parentDepartment option:selected").val();
				if (parentDepartment==""){
					parentDepartment = null;
				}

                var departmentManager = this.$("#departmentManager option:selected").val();
				if (departmentManager==""){
					departmentManager = null;
				}
                var nestingLevel = parseInt(this.$("#parentDepartment option:selected").data('level'))+1;
				if (!nestingLevel){
					nestingLevel=0;
				}
                var users = this.$el.find("#targetUsers .choosen");
                users = _.map(users, function(elm) {
                    return $(elm).attr('id');
                });
                //var _departmentManager = common.toObject(managerId, this.accountDdCollection);
                //var departmentManager = {};
                //if (_departmentManager) {
                //    departmentManager.name = _departmentManager.name.first + " " + _departmentManager.name.last;
                //    departmentManager.id = _departmentManager._id;
                //} else {
                //    departmentManager = currentModel.defaults.departmentManager;
                //}

                this.currentModel.set({
                    departmentName: departmentName,
                    parentDepartment: parentDepartment,
                    departmentManager: departmentManager,
                    nestingLevel: nestingLevel,
                    users: users,
					isAllUpdate:nestingLevel!=this.currentModel.toJSON().nestingLevel
                });

                this.currentModel.save({}, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						self.hideDialog();
                        Backbone.history.navigate("#easyErp/Departments", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },
            hideDialog: function () {
                $(".create-dialog").remove();
            },
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
                                $('.edit-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },
            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON(),
                });
				var self=this;
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    dialogClass: "create-dialog",
                    width: "950px",
                    title: "Edit Department",
                    buttons: [{
								  text: "Save",
								  click: function () { self.saveItem(); }
							  },
							  {
								  text: "Cancel",
								  click: function () { $(this).remove(); }
							  },
							  {
								  text: "Delete",
								  click:self.deleteItem 
							  }]
                });
				common.populateDepartments(App.ID.parentDepartment, "/getDepartmentsForEditDd", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.parentDepartment);} );
                common.populateEmployeesDd(App.ID.departmentManager, "/getPersonsForDd", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.departmentManager);});
				var k=this.currentModel.toJSON().users;
				var b=$.map(this.currentModel.toJSON().users, function (item) {
                    return $('<li/>').text(item.login).attr("id",item._id);
                });
				$('#targetUsers').append(b);
				common.populateUsersForGroups('#sourceUsers',this.currentModel.toJSON());
                return this;
            }

        });

        return EditView;
    });
