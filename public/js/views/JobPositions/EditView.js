define([
    "text!templates/JobPositions/EditTemplate.html",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Workflows/WorkflowsCollection",
    "custom",
    'common'
],
    function (EditTemplate, JobPositionsCollection, DepartmentsCollection, WorkflowsCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "JobPositions",
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
				if (options.myModel){
					this.currentModel = options.myModel
				}
				else{
					this.currentModel = (options.model) ? options.model : options.collection.getElement();
				}
                this.page=1;
                this.pageG=1;
                this.render();
            },

            events: {
                "click .breadcrumb a": "changeWorkflow",
                'keydown': 'keydownHandler',

                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers':'addUsers',
                'click #removeUsers':'removeUsers'
            },

            changeTab:function(e){
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n= $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
            },

            addUser:function(e){
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",

                            click: function(){
                                click: self.addUserToTable("#targetUsers")
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
                var self = this;
                $(document).on("click",".nextUserList",function(e){
                    self.page+=1
                    self.nextUserList(e,self.page)
                });
                $(document).on("click",".prevUserList",function(e){
                    self.page-=1
                    self.prevUserList(e,self.page)
                });

            },

            addGroup:function(e){
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",
                            click: function(){
                                self.addUserToTable("#targetGroups")
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
                var self = this;
                $(document).unbind().on("click",".nextGroupList",function(e){
                    self.pageG+=1
                    self.nextUserList(e,self.pageG)
                });
                $(document).unbind().on("click",".prevGroupList",function(e){
                    self.pageG-=1
                    self.prevUserList(e,self.pageG)
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
                var id=$(e.target).closest("tr").data("id");
                var type=$(e.target).closest("tr").data("type");
                var text=$(e.target).closest("tr").find("td").eq(0).text();
                $("#"+type).append("<option value='"+id+"'>"+text+"</option>");
                $(e.target).closest("tr").remove();
                if ($(".groupsAndUser").find("tr").length==1){
                    $(".groupsAndUser").hide();
                }

            },

            chooseUser:function(e){
                $(e.target).toggleClass("choosen");
            },

            addUserToTable:function(id){
                $(".groupsAndUser").show();
                $(".groupsAndUser tr").each(function(){
                    if ($(this).data("type")==id.replace("#","")){
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function(){
                    $(".groupsAndUser").append("<tr data-type='"+id.replace("#","")+"' data-id='"+ $(this).attr("id")+"'><td>"+$(this).text()+"</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length<2){
                    $(".groupsAndUser").hide();
                }
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
            /*changeWorkflow: function (e) {
                var mid = 39;
                var breadcrumb = $(e.target).closest('li');
                var a = breadcrumb.siblings().find("a");
                if (a.hasClass("active")) {
                    a.removeClass("active");
                }
                breadcrumb.find("a").addClass("active");
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: breadcrumb.data("name"),
                        status: breadcrumb.data("status")
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        mid: mid
                    }

                });

            },*/

            saveItem: function () {
                var self = this;

                var mid = 39;

                var name = $.trim($("#name").val());

                var expectedRecruitment = $.trim($("#expectedRecruitment").val());

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                var department = this.$("#departmentDd option:selected").val();
				if (department==""){
					department=null;
				}

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
                //var _department = common.toObject(departmentId, this.departmentsCollection);
                //var department = {};
                //if (_department) {
                //    department.id = _department._id;
                //    department.name = _department.departmentName;
                //} else {
                //    department = currentModel.defaults.department;
                //}

/*                var workflow = {
                    wName: this.$("#workflowNames option:selected").text(),
                    name: this.$("#workflow option:selected").text(),
                    status: this.$("#workflow option:selected").val(),
                };*/
                var workflow = this.$("#workflowsDd option:selected").val();
                this.currentModel.save({
                    name: name,
                    expectedRecruitment: expectedRecruitment,
                    description: description,
                    requirements: requirements,
                    department: department || null,
                    workflow: workflow || null,
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                }, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        model = model.toJSON();
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/JobPositions", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },
            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
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
				var self = this;
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: false,
                    dialogClass: "edit-dialog",
                    width: "70%",
                    height: 513,
                    title: "Edit Job Position",
                    buttons: [ 
						{
                            text: "Save",
                            click: function () { self.saveItem(); }
                        },
						
						{
							text: "Cancel",
							click: function () { $(this).dialog().remove(); }
						},
						{
							text: "Delete",
							click:self.deleteItem }
						
                    ]
                });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/Users",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/Departments",this.currentModel.toJSON(),this.pageG);

                common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON());
                common.populateWorkflows("Jobposition", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON());

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
                        })

                    }
                return this;
            }

        });

        return EditView;
    });
