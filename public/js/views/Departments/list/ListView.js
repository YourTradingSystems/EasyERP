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
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.startNumber = 0;
            this.render();
        },

        events: {
            "click #showMore": "showMore",
            "click .checkbox": "checked",
            "click #groupList li": "gotoForm",
            "click #groupList .edit": "editItem",
            "click #groupList .trash": "deleteItem"
        },
/*		createDepartmentListRow:function(department,index,className){
			return ('<tr class="'+className+'" data-id="'+department._id+'">'+
				'<td><input type="checkbox" value="department._id" class="checkbox"/></td>'+
				'<td>'+index+'</td>'+
				'<td>'+department.departmentName+'</td>'+
				'<td>'+((department.departmentManager) ? department.departmentManager.name.first + ' ' + department.departmentManager.name.last : '')+'</td>'+
				'<td><a href="#">'+department.users.length+'</a></td>'+
				'</tr>');
		},*/
		createDepartmentListRow:function(department,index,className){
		    return ('<li class="' + className + '" data-id="' + department._id + '"><span class="dotted-line"></span><span class="text">' + department.departmentName + ' (' + department.users.length + ')<span title="delete" class="trash"></span><span title="edit" class="edit"></span></span></li>');
		},
        editItem: function(e){
            //create editView in dialog here
            new EditView({myModel:this.collection.get($(e.target).closest("li").data("id"))});
			return false;
        },
        deleteItem: function(e){
			var myModel=this.collection.get($(e.target).closest("li").data("id"))
            var mid = 39;
            event.preventDefault();
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

        render: function () {
            console.log('Departments render');
            $('.ui-dialog ').remove();
            this.$el.html(_.template(ListTemplate));
//            this.$el.append(new ListItemView({ collection: this.collection, startNumber: this.startNumber }).render());
			var departments = this.collection.toJSON();
            departments.forEach(function(elm) {
                elm.child.forEach(function(elm1) {
                    this.$el.find("#groupList").append(this.createDepartmentListRow(elm1, i + 1, "parent"));
                });
            });
			//for (var i=0;i<parentDepartments.length;i++){
			//	this.$el.find("#groupList").append(this.createDepartmentListRow(parentDepartments[i],i+1,"parent"));
			//	var k=0;
			//	for (var j=childDepartments.length-1;j>=0;j--){
			//		if (childDepartments[j].parentDepartment._id==parentDepartments[i]._id){
			//			k++;
			//			this.$el.find("#groupList").append(this.createDepartmentListRow(childDepartments[j],k,"child"));
			//			childDepartments.splice(j,1);
			//		}
					
			//	}
			//}
//            this.$el.append(new ListItemView({ collection: this.collection, startNumber: this.startNumber }).render());
            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({count: 50});
        },

        showMoreContent: function (newModels) {
            new ListItemView({ collection: newModels, startNumber: this.startNumber }).render();
            this.startNumber += newModels.length;
        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("li").data("id");
            window.location.hash = "#easyErp/Departments/form/" + id;
        },

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
