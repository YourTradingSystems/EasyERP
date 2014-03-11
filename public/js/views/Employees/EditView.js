define([
    "text!templates/Employees/EditTemplate.html",
    'text!templates/Notes/AddAttachments.html',
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Users/UsersCollection",
    "common",
    "populate"
],
    function (EditTemplate, addAttachTemplate, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, UsersCollection, common, populate) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
            if (options.collection) {
                this.employeesCollection = options.collection;
                this.currentModel = this.employeesCollection.getElement();
            } else {
                this.currentModel = options.model;
            }
                this.currentModel.urlRoot = '/Employees';
                this.page=1;
                this.pageG=1;
                this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers':'addUsers',
                'click #removeUsers':'removeUsers',
                'click .endContractReasonList, .withEndContract .arrow': 'showEndContractSelect',
                'click .withEndContract .newSelectList li': 'endContract',
				"click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect"
            },

            notHide: function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            showEndContractSelect: function (e) {
                e.preventDefault();
				$(e.target).parent().find(".newSelectList").toggle();
				return false;
            },
            endContract: function (e) {
                var wfId = $('.endContractReasonList').attr('data-id');
                var contractEndReason = $(e.target).text();
                this.currentModel.set({ workflow: wfId, contractEndReason: contractEndReason, workflowContractEnd: true });
                this.currentModel.save({}, {
                    success: function () {
                        Backbone.history.navigate("easyErp/Applications/kanban", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
					}
                });
            },

            fileSizeIsAcceptable: function(file){
                if(!file){return false;}
                return file.size < App.File.MAXSIZE;
            },
            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.currentModel;
                var currentModelID = currentModel["id"];
                var addFrmAttach = $("#editEmployeeForm");
                var addInptAttach = $("#editEmployeeForm .input-file .inputAttach")[0].files[0];
                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    $('#inputAttach').val('');
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    var bar = $('.bar');
                    var status = $('.status');
                    var formURL = "http://" + window.location.host + "/uploadEmployeesFiles";
                    e.preventDefault();
                    addFrmAttach.ajaxSubmit({
                        url: formURL,
                        type: "POST",
                        processData: false,
                        contentType: false,
                        data: [addInptAttach],

                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("id", currentModelID);
                            status.show();
                            var statusVal = '0%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },
                        
                        uploadProgress: function(event, position, total, statusComplete) {
                            var statusVal = statusComplete + '%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },
                        
                        success: function (data) {
                            var attachments = currentModel.get('attachments');
  							attachments.length=0;
							$('.attachContainer').empty();
							data.data.attachments.forEach(function(item){
								var date = common.utcDateToLocaleDate(item.uploadDate);
								attachments.push(item);
								$('.attachContainer').prepend(_.template(addAttachTemplate, { data: item, date: date }));
							});
                            console.log('Attach file');
                            addFrmAttach[0].reset();
                            status.hide();
                        },

                        error: function () {
                            console.log("Attach file error");
                        }
                    });
				});
				addFrmAttach.submit();
				addFrmAttach.off('submit');
			},

            deleteAttach: function (e) {
                if (confirm("You realy want to remove file? ")) {
                    if ($(e.target).closest("li").hasClass("attachFile")) {
                        $(e.target).closest(".attachFile").remove();
                    } else {
                        var id = e.target.id;
                        var currentModel = this.currentModel;
                        var attachments = currentModel.get('attachments');
                        var new_attachments = _.filter(attachments, function(attach) {
                            if (attach._id != id) {
                                return attach;
                            }
                        });
                        var fileName = $('.attachFile_' + id + ' a')[0].innerHTML;
                        currentModel.save({ 'attachments': new_attachments, fileName: fileName },
                            {
                                headers: {
                                    mid: 39
                                },
                                patch: true,
                                success: function(model, response, options) {
                                    $('.attachFile_' + id).remove();
                                }
                            });
                    }
                }
            },

            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = holder.closest(".dialog-tabs").parent().find(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },
			updateAssigneesPagination:function(el){
				var pag = el.find(".userPagination .text");
				el.find(".userPagination .nextUserList").remove();
				el.find(".userPagination .prevUserList").remove();
				el.find(".userPagination .nextGroupList").remove();
				el.find(".userPagination .prevGroupList").remove();

				var list = el.find("ul");
				var count = list.find("li").length;
				var s ="";
				var page  = parseInt(list.attr("data-page"));
				if (page>1){
					el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
				}
				if (count===0){
					s+="0-0 of 0";
				}else{
					if ((page)*20-1<count){
						s+=((page-1)*20+1)+"-"+((page)*20)+" of "+count;
					}else{
						s+=((page-1)*20+1)+"-"+(count)+" of "+count;
					}
				}
				
				if (page<count/20){
					el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
				}
				el.find("ul li").hide();
				for (var i=(page-1)*20;i<20*page;i++){
					el.find("ul li").eq(i).show();
				}
 
				pag.text(s);
			},

            addUser:function(){
                var self = this;
                $(".addUserDialog").dialog({
                    dialogClass: "add-user-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",

                            click: function(){
                                self.addUserToTable("#targetUsers");
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
				this.updateAssigneesPagination($("#sourceUsers").closest(".left"));
				this.updateAssigneesPagination($("#targetUsers").closest(".left"));
                $("#targetUsers").on("click", "li", {self:this},this.removeUsers);
                $("#sourceUsers").on("click", "li", {self:this},this.addUsers);
                $(document).on("click", ".nextUserList",{self:this}, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevUserList",{self:this}, function (e) {
                    self.prevUserList(e);
                });
            },

            addGroup:function(){
                var self = this;
                $(".addGroupDialog").dialog({
                    dialogClass: "add-group-dialog",
                    width: "900px",
                    buttons:{
                        save:{
                            text:"Choose",
                            class:"btn",
                            click: function(){
                                self.addUserToTable("#targetGroups");
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
				this.updateAssigneesPagination($("#sourceGroups").closest(".left"));
				this.updateAssigneesPagination($("#targetGroups").closest(".left"));
                $("#targetGroups").on("click", "li", {self:this},this.removeUsers);
                $("#sourceGroups").on("click", "li", {self:this},this.addUsers);
                $(document).on("click", ".nextUserList",{self:this}, function (e) {
                    self.nextUserList(e);
                });
                $(document).on("click", ".prevUserList",{self:this}, function (e) {
                    self.prevUserList(e);
                });
            },


            nextUserList: function (e, page) {
				$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))+1);
				e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },

            prevUserList: function (e, page) {
				$(e.target).closest(".left").find("ul").attr("data-page",parseInt($(e.target).closest(".left").find("ul").attr("data-page"))-1);
				e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
            },

            addUsers: function (e) {
                e.preventDefault();
				$(e.target).parents("ul").find("li:not(:visible)").eq(0).show();
				var div =$(e.target).parents(".left");
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target));
				e.data.self.updateAssigneesPagination(div);
				div =$(e.target).parents(".left");
				e.data.self.updateAssigneesPagination(div);

            },

            removeUsers: function (e) {
                e.preventDefault();
				var div =$(e.target).parents(".left");
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target));
				e.data.self.updateAssigneesPagination(div);
				div =$(e.target).parents(".left");
				e.data.self.updateAssigneesPagination(div);
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

            addUserToTable:function(id) {
                var groupsAndUser_holder = $(".groupsAndUser");
                var groupsAndUserHr_holder = $(".groupsAndUser tr");
                groupsAndUser_holder.show();
                groupsAndUserHr_holder.each(function(){
                    if ($(this).data("type")==id.replace("#","")){
                        $(this).remove();
                    }
                });
                $(id).find("li").each(function(){
                    groupsAndUser_holder.append("<tr data-type='"+id.replace("#","")+"' data-id='"+ $(this).attr("id")+"'><td>"+$(this).text()+"</td><td class='text-right'></td></tr>");
                });
                if ($(".groupsAndUser tr").length <2) {
                    groupsAndUser_holder.hide();
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
            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display:"block"
                }, 250);
               
            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);
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

            saveItem: function () {
                var self = this;
				
                var gender = $("#genderDd").data("id");
                gender = gender ? gender : null;

                var jobType = $("#jobTypeDd").data("id");
                jobType = jobType ? jobType : null;

                var marital = $("#maritalDd").data("id");
                marital = marital ? marital : null;

                var relatedUser = this.$el.find("#relatedUsersDd").data("id");
                relatedUser = relatedUser ? relatedUser : null;

                var department = this.$el.find("#departmentsDd").data("id");
                department = department ? department : null;

                var jobPosition = this.$el.find("#jobPositionDd").data("id");
                jobPosition = jobPosition ? jobPosition : null;

                var manager = this.$el.find("#projectManagerDD").data("id");
                manager = manager ? manager : null;

                var coach = $.trim(this.$el.find("#coachDd").data("id"));
                coach = coach ? coach : null;

                var homeAddress = {};
                $("dd").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = $.trim(el.val());
                });
                // date parse 
                var dateBirthSt = $.trim($("#dateBirth").val());
                var dateBirth = "";
                if (dateBirthSt) {
                	dateBirthArr = dateBirthSt.split("/");
                    var newDateBirt = new Date();  
                    newDateBirt.setFullYear(dateBirthArr[2]);
                    newDateBirt.setMonth(dateBirthArr[1]-1);    
                    newDateBirt.setDate(dateBirthArr[0]); 
                    var fullDateBirt = newDateBirt.toUTCString();
                    dateBirth = new Date(Date.parse(fullDateBirt)).toISOString();
                }
                var recalculate = (this.currentModel.attributes.dateBirth == dateBirthSt) ? false : true;

                var active = (this.$el.find("#active").is(":checked")) ? true : false;
                var sourceId = $("#sourceDd").data("id");

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
                    name: {
                        first: $.trim(this.$el.find("#first").val()),
                        last: $.trim(this.$el.find("#last").val())
                    },
                    gender: gender,
                    jobType: jobType,
                    marital: marital,
                    workAddress: {
                        street:$.trim( this.$el.find('#street').val()),
                        city: $.trim(this.$el.find('#city').val()),
                        state: $.trim(this.$el.find('#state').val()),
                        zip: $.trim(this.$el.find('#zip').val()),
                        country: $.trim(this.$el.find('#country').val())
                    },
                    tags: $.trim(this.$el.find("#tags").val()).split(','),
                    workEmail: $.trim(this.$el.find("#workEmail").val()),
                    personalEmail:$.trim(this.$el.find("#personalEmail").val()),
                    skype: $.trim(this.$el.find("#skype").val()),
                    workPhones: {
                        phone: $.trim(this.$el.find("#phone").val()),
                        mobile: $.trim(this.$el.find("#mobile").val())
                    },
                    officeLocation: $.trim(this.$el.find("#officeLocation").val()),
                    relatedUser: relatedUser,
                    department: department,
                    jobPosition: jobPosition,
                    manager: manager,
                    coach: coach,
                    identNo: $.trim($("#identNo").val()),
                    passportNo: $.trim(this.$el.find("#passportNo").val()),
                    otherId: $.trim(this.$el.find("#otherId").val()),
                    homeAddress: homeAddress,
                    dateBirth: dateBirth,
                    active: active,
                    source: sourceId,
                    imageSrc: this.imageSrc,
                    recalculate: recalculate,
                    groups: {
                        owner: $("#allUsers").val(),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                };
                this.currentModel.save(data,{
                        headers: {
                            mid: 39
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            self.hideDialog();
                        },
                    error: function (model, xhr) {
    					self.errorNotification(xhr);
                    }

                });

            },
            deleteItem: function(event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                    var answer = confirm("Realy DELETE items ?!");
                    if (answer == true) {
						this.currentModel.urlRoot = "/Employees";
                        this.currentModel.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                $('.edit-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function (model, xhr) {
    							self.errorNotification(xhr);
							}
						});
                }
            },

            render: function () {
                if (this.currentModel.get('dateBirth')) {
                    this.currentModel.set({
                        dateBirth: this.currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/')
                    }, {
                        silent: true
                    });
                }
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    dialogClass: "edit-dialog",
                    width: 1000,
                    buttons:{
                        save:{
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel:{
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
                common.getWorkflowContractEnd("Applications", null, null, "/Workflows", null, "Contract End", function (workflow) {
                    $('.endContractReasonList').attr('data-id', workflow[0]._id);
                });
                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);

				populate.get("#jobTypeDd", "/jobType", {}, "name", this);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
				populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this, false, true);
				populate.get("#relatedUsersDd", "/UsersForDd", {}, "login", this, false, true);
				populate.get("#departmentsDd", "/DepartmentsForDd", {}, "departmentName", this);
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);

                
                $('#dateBirth').datepicker({
                	dateFormat: "d/m/yy",
                    changeMonth : true,
                    changeYear : true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-1d'
                });
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
                        });

                    }
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });
