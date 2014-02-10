define([
    "text!templates/Employees/EditTemplate.html",
    'text!templates/Notes/AddAttachments.html',
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Users/UsersCollection",
    "common"
],
    function (EditTemplate, addAttachTemplate, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, UsersCollection, common) {

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
                this.page=1;
                this.pageG=1;
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                'keydown': 'keydownHandler',
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
                'click .dialog-tabs a': 'changeTab',
                'click .addUser': 'addUser',
                'click .addGroup': 'addGroup',
                'click .unassign': 'unassign',
                'click #targetUsers li': 'chooseUser',
                'click #addUsers':'addUsers',
                'click #removeUsers':'removeUsers'
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
                var addInptAttach = $(".input-file .inputAttach")[0].files[0];
                if(!this.fileSizeIsAcceptable(addInptAttach)){
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
					if ($(e.target).closest("li").hasClass("attachFile")){
						$(e.target).closest(".attachFile").remove();
					}
					else{
						var id = e.target.id;
						var currentModel = this.currentModel;
						var attachments = currentModel.get('attachments');
						var new_attachments = _.filter(attachments, function (attach) {
							if (attach._id != id) {
								return attach;
							}
						});
						currentModel.save({'attachments': new_attachments},
										  {
											  headers: {
												  mid: 39
											  },
											  patch:true,
											  success: function (model, response, options) {
												  $('.attachFile_' + id).remove();
											  }
										  });
					}
				},

            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
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
                $("#targetUsers").unbind().on("click","li",this.removeUsers);
                $("#sourceUsers").unbind().on("click","li",this.addUsers);
                $(document).on("click",".nextUserList",function(e){
                    self.page += 1;
                    self.nextUserList(e,self.page);
                });
                $(document).on("click",".prevUserList",function(e){
                    self.page -= 1;
                    self.prevUserList(e,self.page);
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
                $("#targetGroups").unbind().on("click","li",this.removeUsers);
                $("#sourceGroups").unbind().on("click","li",this.addUsers);
                $(document).unbind().on("click",".nextGroupList",function(e){
                    self.pageG += 1;
                    self.nextUserList(e,self.pageG);
                });
                $(document).unbind().on("click",".prevGroupList",function(e){
                    self.pageG -= 1;
                    self.prevUserList(e,self.pageG);
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
                if (groupsAndUserHr_holder.length<2){
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
                $(".edit-employee-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
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
                
                var gender = $("#genderDd option:selected").val();
                gender = gender ? gender : null;

                var jobType = $("#jobTypeDd option:selected").text();
                jobType = jobType ? jobType : null;

                var marital = $("#maritalDd option:selected").val();
                marital = marital ? marital : null;

                var relatedUser = this.$el.find("#relatedUsersDd option:selected").val();
                relatedUser = relatedUser ? relatedUser : null;

                var department = this.$el.find("#departmentsDd option:selected").val();
                department = department ? department : null;

                var jobPosition = this.$el.find("#jobPositionDd option:selected").val();
                jobPosition = jobPosition ? jobPosition : null;

                var manager = this.$el.find("#projectManagerDD option:selected").val();
                manager = manager ? manager : null;

                var coach = $.trim(this.$el.find("#coachDd option:selected").val());
                coach = coach ? coach : null;

                var homeAddress = {};
                $("dd").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = $.trim(el.val());
                });

                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var dateBirth = "";
                if (dateBirthSt) {
                    dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
                }
                var recalculate = (this.currentModel.attributes.dateBirth == dateBirthSt) ? false : true;

                var active = (this.$el.find("#active").is(":checked")) ? true : false;

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
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                            self.hideDialog();
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
                                $('.edit-employee-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-employee-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
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
                    dialogClass: "edit-employee-dialog",
                    width: 800,
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
                common.populateUsersForGroups('#sourceUsers','#targetUsers',this.currentModel.toJSON(),this.page);
                common.populateUsers("#allUsers", "/UsersForDd",this.currentModel.toJSON(),null,true);
                common.populateDepartmentsList("#sourceGroups","#targetGroups", "/DepartmentsForDd",this.currentModel.toJSON(),this.pageG);
                common.populateJobTypeDd("#jobTypeDd", "/jobType", this.currentModel.toJSON());
                common.populateUsers("#relatedUsersDd", "/UsersForDd", this.currentModel.toJSON());
                common.populateDepartments("#departmentsDd", "/DepartmentsForDd",this.currentModel.toJSON());
                common.populateJobPositions("#jobPositionDd", "/JobPositionForDd", this.currentModel.toJSON());
                common.populateCoachDd("#coachDd", "/getPersonsForDd", this.currentModel.toJSON());
                common.populateEmployeesDd("#projectManagerDD", "/getPersonsForDd", this.currentModel.toJSON());
                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                $('#dateBirth').datepicker({
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
                        })

                    }
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });
