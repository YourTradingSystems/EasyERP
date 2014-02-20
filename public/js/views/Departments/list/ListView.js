define([
    'text!templates/Departments/list/ListHeader.html',
    'views/Departments/CreateView',
    'views/Departments/list/ListItemView',
    'views/Departments/EditView',
],

function (ListTemplate, CreateView, ListItemView, EditView) {
    var DepartmentsListView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
			this.startTime = options.startTime;
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.startNumber = 0;
            this.render();
        },

        events: {
            "click #showMore": "showMore",
            "click .checkbox": "checked",
            "click #groupList li": "editItem",
            "click #groupList .edit": "editItem",
            "click #groupList .trash": "deleteItem"
        },
        /*createDepartmentListRow:function(department,index,className){
			return ('<tr class="'+className+'" data-id="'+department._id+'">'+
				'<td><input type="checkbox" value="department._id" class="checkbox"/></td>'+
				'<td>'+index+'</td>'+
				'<td>'+department.departmentName+'</td>'+
				'<td>'+((department.departmentManager) ? department.departmentManager.name.first + ' ' + department.departmentManager.name.last : '')+'</td>'+
				'<td><a href="#">'+department.users.length+'</a></td>'+
				'</tr>');
		},*/
		createDepartmentListRow:function(department,index,className){
		    return ('<li class="' + className + '" data-id="' + department._id + '" data-level="' + department.nestingLevel + '" data-sequence="' + department.sequence + '"><span class="content"><span class="dotted-line"></span><span class="text">' + department.departmentName + '<span title="delete" class="trash icon">1</span><span title="edit" class="edit icon">e</span></span></span></li>');
		},
        editItem: function(e){
            //create editView in dialog here
            new EditView({myModel:this.collection.get($(e.target).closest("li").data("id"))});
			return false;
        },
        deleteItem: function(e){
			var myModel=this.collection.get($(e.target).closest("li").data("id"))
            var mid = 39;
            e.preventDefault();
            var self = this;
            var answer = confirm("Realy DELETE items ?!");
            if (answer == true) {
                myModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
						self.render();
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            }

			return false;
        },
		groupMove:function (){
			$("#groupList li").each(function(){
				if ($(this).find("li").length>0){
					$(this).attr("class","parent");
				}
				else{
					$(this).attr("class","child");
				}
			});
		},
        render: function () {
            console.log('Departments render');
            $('.ui-dialog ').remove();
            this.$el.html(_.template(ListTemplate));
//            this.$el.append(new ListItemView({ collection: this.collection, startNumber: this.startNumber }).render());
            var departments = this.collection.toJSON();
			console.log(departments);
            var self = this;
            departments.forEach(function(elm, i) {
                if (!elm.parentDepartment) {
                    self.$el.find("#groupList").append(self.createDepartmentListRow(elm, i + 1, "child"));
                } else {
                    var par = self.$el.find("[data-id='" + elm.parentDepartment._id + "']").removeClass('child').addClass('parent')
					if (par.find("ul").length===0){
						par.append("<ul style='margin-left:20px'></ul>");
					}
					par.find("ul").append(self.createDepartmentListRow(elm, i + 1, "child"));
					

						
                }
            });
//			this.groupMove();
			self = this;
			this.$("ul").sortable({
				connectWith: 'ul',
                stop: function (event, ui) {
					self.groupMove();
					console.log(ui.item.attr("data-id"));
					var model = self.collection.get(ui.item.attr("data-id"));
					var sequence=0;
					var nestingLevel=0;
					if (ui.item.next().hasClass("parent")||ui.item.next().hasClass("child")){
						sequence = parseInt(ui.item.next().attr("data-sequence"))+1;
					}
					if (ui.item.parents("li").length>0){
						nestingLevel=parseInt(ui.item.parents("li").attr("data-level"));
					}
					model.set({"parentDepartmentStart":model.toJSON().parentDepartment,"sequenceStart":parseInt(ui.item.attr("data-sequence")),"parentDepartment":ui.item.parents("li").attr("data-id")?ui.item.parents("li").attr("data-id"):null, "nestingLevel":nestingLevel, departmentManager:model.toJSON.departmentManager?model.toJSON.departmentManager._id:null, sequence:sequence});
					model.save();
					ui.item.attr("data-sequence",sequence);
					console.log(ui.item.parents("li").attr("data-id"));
				}
			});
//            this.$el.append(new ListItemView({ collection: this.collection, startNumber: this.startNumber }).render());
            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });
			this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({count: 50});
        },

        showMoreContent: function (newModels) {
            new ListItemView({ collection: newModels, startNumber: this.startNumber }).render();
            this.startNumber += newModels.length;
        },
        /*gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("li").data("id");
            //window.location.hash = "#easyErp/Departments/form/" + id;
        },*/

        createItem: function () {
            //create editView in dialog here
            new CreateView();
        },

        checked: function () {
            if (this.collection.length > 0) {
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                {
                    $("#top-bar-deleteBtn").hide();
                    $('#check_all').prop('checked', false);
                }
            }
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model;
            $.each($("tbody input:checked"), function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
            });

            this.collection.trigger('reset');
        }

    });

    return DepartmentsListView;
});
