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
				this.page=1;
                this.render();
            },
			events:{
                'click .dialog-tabs a': 'changeTab',
                'click #sourceUsers li': 'addUsers',
                'click #targetUsers li': 'removeUsers',
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
				"click .prevUserList":"prevUserList",
				"click .nextUserList":"nextUserList",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
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
            addUsers: function (e) {
                e.preventDefault();
                $('#targetUsers').append($(e.target));
            },
            removeUsers: function (e) {
                e.preventDefault();
                $('#sourceUsers').append($(e.target));
            },

			changeTab:function(e){
				$(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
				$(e.target).addClass("active");
				var n= $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
				$(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
				$(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
			},

			hideNewSelect:function(e){
				$(".newSelectList").hide();
			},
            showNewSelect:function(e,prev,next){
				var elementVisible = 25;
				var newSel = $(e.target).parent().find(".newSelectList")
				if (prev||next){
					newSel = $(e.target).closest(".newSelectList")
				}
				var parent = newSel.length>0?newSel.parent():$(e.target).parent();
                var currentPage = 1;
                if (newSel.is(":visible")&&!prev&&!next){
                    newSel.hide();
					return;
				}

                if (newSel.length){
                    currentPage = newSel.data("page");
                    newSel.remove();
                }
				if (prev)currentPage--;
				if (next)currentPage++;
                var s="<ul class='newSelectList' data-page='"+currentPage+"'>";
                var start = (currentPage-1)*elementVisible;
				var options = parent.find("select option");
                var end = Math.min(currentPage*elementVisible,options.length);
                for (var i = start; i<end;i++){
                    s+="<li class="+$(options[i]).text().toLowerCase()+">"+$(options[i]).text()+"</li>";                                                
                }
				var allPages  = Math.ceil(options.length/elementVisible)
                if (options.length>elementVisible)
                    s+="<li class='miniStylePagination'><a class='prev"+ (currentPage==1?" disabled":"")+"' href='javascript:;'>&lt;Prev</a><span class='counter'>"+(start+1)+"-"+end+" of "+parent.find("select option").length+"</span><a class='next"+ (currentPage==allPages?" disabled":"")+"' href='javascript:;'>Next&gt;</a></li>";
                s+="</ul>";
                parent.append(s);
                return false;
                
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
                var users = this.$el.find("#targetUsers li");
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
				common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                return this;
            }

        });

        return EditView;
    });
