define([
    "text!templates/Persons/EditTemplate.html",
    "common",
    "custom",
    "dataService"
],
    function (EditTemplate, common, Custom, dataService) {

        var EditView = Backbone.View.extend({
            contentType: "Persons",
            imageSrc: '',
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
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
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
            notHide: function (e) {
				return false;
            },
			nextSelect:function(e){
				this.showNewSelect(e,false,true)
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false)
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
            hideDialog: function () {
                $('.edit-person-dialog').remove();
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
            saveItem: function (event) {
                var self = this;
                var mid = 39;

                //var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var dateBirth = this.$el.find(".dateBirth").val();
                var company = $('#companiesDd option:selected').val();
                company = (company) ? company : null;

                var department = $("#departmentDd option:selected").val();
                department = (department) ? department : null;

                var jobPosition = $.trim(this.$el.find('#jobPositionInput').val());
                jobPosition = (jobPosition) ? jobPosition : null;

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
                    imageSrc: this.imageSrc,
                    name: {
                        first: $.trim(this.$el.find('#firstName').val()),
                        last: $.trim(this.$el.find('#lastName').val())
                    },
                    dateBirth: dateBirth,
                    department: department,
                    company: company,
                    address: {
                        street: $.trim(this.$el.find('#addressInput').val()),
                        city: $.trim(this.$el.find('#cityInput').val()),
                        state: $.trim(this.$el.find('#stateInput').val()),
                        zip: $.trim(this.$el.find('#zipInput').val()),
                        country: $.trim(this.$el.find('#countryInput').val())
                    },
                    website: $.trim(this.$el.find('#websiteInput').val()),
                    jobPosition: jobPosition,
                    skype: $.trim(this.$el.find('#skype').val()),
                    phones: {
                        phone: $.trim(this.$el.find('#phoneInput').val()),
                        mobile: $.trim(this.$el.find('#mobileInput').val()),
                        fax: $.trim(this.$el.find('#faxInput').val())
                    },
                    email: $.trim(this.$el.find('#emailInput').val()),
                    salesPurchases: {
                        isCustomer: $('#isCustomerInput').is(':checked'),
                        isSupplier: $('#isSupplierInput').is(':checked'),
                        active: $('#isActiveInput').is(':checked')
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
                        self.hideDialog();
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Persons/form/" + model.id, { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        self.hideDialog();
                        if (xhr && xhr.status === 401) {
                            Backbone.history.navigate("login", { trigger: true });
                        } else {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    }
                });
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

    
            hideNewSelect: function (e) {
                $(".newSelectList").hide();;
            },
            chooseOption: function (e) {
                var k = $(e.target).parent().find("li").index($(e.target));
                $(e.target).parents("dd").find("select option:selected").removeAttr("selected");
                $(e.target).parents("dd").find("select option").eq(k).attr("selected", "selected");
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text());
            },
            styleSelect: function (id) {
                var text = $(id).find("option:selected").length == 0 ? $(id).find("option").eq(0).text() : $(id).find("option:selected").text();
                $(id).parent().append("<a class='current-selected' href='javascript:;'>" + text + "</a>");
                $(id).hide();
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
                                $('.edit-person-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-person-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },
            render: function () {
                var self = this;
                console.log('render persons dialog');
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-person-dialog",
                    title: "Edit Person",
                    width: "80%",
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
							click: self.deleteItem }
						]

                });
                this.$el.find('.dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);
                common.populateCompanies(App.ID.companiesDd, "/CompaniesForDd", this.currentModel.toJSON(), function () { self.styleSelect(App.ID.companiesDd); });
                common.populateDepartments(App.ID.departmentDd, "/DepartmentsForDd", this.currentModel.toJSON(), function () { self.styleSelect(App.ID.departmentDd); });
                this.styleSelect(App.ID.titleDd);
                this.styleSelect(App.ID.tagsDd);
                //                this.populateDropDown("company", App.ID.companiesDd, "/Companies");
                //this.populateDropDown("person", App.ID.assignedToDd, "/getPersonsForDd");
                this.styleSelect("#type");
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
                        })

                    }
                return this;
            }

        });

        return EditView;
    });
