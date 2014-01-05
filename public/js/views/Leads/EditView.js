define([
    "text!templates/Leads/EditTemplate.html",
    "custom",
    'common',
    'dataService'
],
    function (EditTemplate, Custom, common, dataService) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.page=1;
                this.pageG=1;
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow",
                "change #customer": "selectCustomer",
                "change #workflowNames": "changeWorkflows",
                "change #workflowNames": "changeWorkflows",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
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
//=============
            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

            hideDialog: function () {
                $(".edit-leads-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
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

            changeWorkflows: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.contentCollection.models[itemIndex].toJSON();
                    var name = this.$("#workflowNames option:selected").val();
                    var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                    //$("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(value) }));
                }
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            saveItem: function () {
                var mid = 39;

                var name = $.trim(this.$el.find("#name").val());

                var company = $.trim(this.$el.find("#company").val());

                var idCustomer = $("#customerDd option:selected").val();
                idCustomer = idCustomer ? idCustomer : null;
                var address = {};
                $("p").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var salesPersonId = this.$("#salesPerson option:selected").val();
                salesPersonId = salesPersonId ? salesPersonId : null;
                var salesTeamId = this.$("#salesTeam option:selected").val();
                salesTeamId = salesTeamId ? salesTeamId : null;
                var first = $.trim(this.$el.find("#first").val());
                var last = $.trim(this.$el.find("#last").val());
                var contactName = {
                    first: first,
                    last: last
                };

                var email = $.trim(this.$el.find("#email").val());
                var func = $.trim(this.$el.find("#func").val());

                var phone = $.trim(this.$el.find("#phone").val());
                var mobile = $.trim(this.$el.find("#mobile").val());
                var fax = $.trim(this.$el.find("#fax").val());
                var phones = {
                    phone: phone,
                    mobile: mobile,
                    fax: fax
                };

                var workflow = this.$("#workflowsDd option:selected").data('id');
                workflow = workflow ? workflow : null;
                var priority = $("#priorityDd option:selected").val();

                var internalNotes = $.trim($("#internalNotes").val());

                var active;
                if ($("#active").is(":checked")) { console.log("true"); active = true; }
                else { active = false; }

                var optout;
                if ($("#optout").is(":checked")) { optout = true; }
                else { optout = false; }

                var reffered = $.trim($("#reffered").val());
                var self = this;

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

                this.currentModel.save({
                    name: name,
                    company: company,
                    campaign: this.$el.find('#campaignDd option:selected').val(),
                    source: this.$el.find('#sourceDd option:selected').val(),
                    customer: idCustomer,
                    address: address,
                    salesPerson: salesPersonId,
                    salesTeam: salesTeamId,
                    contactName: contactName,
                    email: email,
                    func: func,
                    phones: phones,
                    workflow: workflow,
                    fax: fax,
                    priority: priority,
                    internalNotes: internalNotes,
                    active: active,
                    optout: optout,
                    reffered: reffered,
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
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Leads", { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
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
                                $('.edit-leads-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-leads-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },

			showNewSelect:function(e){
				var s="<ul class='newSelectList'>";
				$(e.target).parent().find("select option").each(function(){
					s+="<li>"+$(this).text()+"</li>";
				});
				 s+="</ul>";
				$(e.target).parent().append(s);
				
			},

			hideNewSelect:function(e){
				$(".newSelectList").remove();;
			},

			chooseOption:function(e){
				var k = $(e.target).parent().find("li").index($(e.target));
				$(e.target).parents("dd").find("select option:selected").removeAttr("selected");
				$(e.target).parents("dd").find("select option").eq(k).attr("selected","selected");
				$(e.target).parents("dd").find(".current-selected").text($(e.target).text());
			},

			styleSelect:function(id){
				var text = $(id).find("option:selected").length==0?$(id).find("option").eq(0).text():$(id).find("option:selected").text();
				$(id).parent().append("<a class='current-selected' href='javascript:;'>"+text+"</a>");
				$(id).hide();
			},

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-leads-dialog",
                    width: 900,
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        },
                        delete:{
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/Users",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/Departments",this.currentModel.toJSON(),this.pageG);

                common.populateCustomers(App.ID.customerDd, "/Customer", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.customerDd);});
                common.populateDepartments(App.ID.salesTeam, "/Departments", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.salesTeam);});
                common.populateEmployeesDd(App.ID.salesPerson, "/getPersonsForDd", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.salesPerson);});
                common.populatePriority(App.ID.priorityDd, "/Priority", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.priorityDd);});
                common.populateWorkflows("Lead", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.workflowDd);self.styleSelect(App.ID.workflowNamesDd);});
				this.styleSelect("#sourceDd");
				this.styleSelect("#campaignDd");
                this.delegateEvents(this.events);
                $('#campaignDd').val(this.currentModel.get('campaign'));
                $('#sourceDd').val(this.currentModel.get('source'));

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
