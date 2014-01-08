define([
    "text!templates/Applications/EditTemplate.html",
    'text!templates/Notes/AddAttachments.html',
    "common",
    "custom"
],
    function (EditTemplate, addAttachTemplate, common, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            imageSrc: '',
            template: _.template(EditTemplate),
            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.employeesCollection = options.collection;
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #refuse": "changeWorkflow",
                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows",
                'keydown': 'keydownHandler',
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
            },
            fileSizeIsAcceptable: function(file){
                if(!file){return false;}
                return file.size < App.File.MAXSIZE;
            },
            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.currentModel;
                var currentModelID = currentModel["id"];
                var addFrmAttach = $("#createApplicationForm");
                var addInptAttach = $(".input-file .inputAttach")[0].files[0];
                if(!this.fileSizeIsAcceptable(addInptAttach)){
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    var bar = $('.bar');
                    var status = $('.status');
                    var formURL = "http://" + window.location.host + "/uploadApplicationFiles";
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
				})
				addFrmAttach.submit();
				addFrmAttach.off('submit');
			},
/*
			addAttach: function (event) {
				var s= $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length-1];
				$(".attachContainer").append('<li class="attachFile">'+
											 '<a href="javascript:;">'+s+'</a>'+
											 '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
											);
				$(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden","hidden"));
				$(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
			},
*/
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
						currentModel.set('attachments', new_attachments);
						currentModel.save({},
										  {
											  headers: {
												  mid: 39
											  },

											  success: function (model, response, options) {
												  $('.attachFile_' + id).remove();
											  }
										  });
					}
				},


            changeWorkflows: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.applicationsCollection.models[itemIndex].toJSON();
                    var name = this.$("#workflowNames option:selected").val();
                    var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                    $("#selectWorkflow").html(_.template(editSelectTemplate, { model: currentModel, workflows: this.getWorkflowValue(value) }));
                }
            },
            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            isEmployee: function (e) {
                var mid = 39;
                var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                model.set({ isEmployee: true });
                model.save({}, {
                    headers: {
                        mid: mid
                    }
                });
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

            hideDialog: function () {
                $(".applications-edit-dialog").remove();
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

            saveItem: function () {
                var self = this;
                var mid = 39;

                var relatedUser = this.$el.find("#relatedUsersDd option:selected").val();
                relatedUser = relatedUser ? relatedUser : null;

                var department = this.$el.find("#departmentDd option:selected").val();
                department = department ? department : null;

                var nextAction = $.trim(this.$el.find("#nextAction").val());
                /*var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }*/
                var jobPositionId = this.$el.find("#jobPositionDd option:selected").val() ? this.$el.find("#jobPositionDd option:selected").val() : null;

                var data = {
                    //subject: this.$el.find("#subject").val(),
                    imageSrc: this.imageSrc,
                    name: {
                        first: this.$el.find("#first").val(),
                        last: this.$el.find("#last").val()
                    },
                    personalEmail: $.trim(this.$el.find("#wemail").val()),
                    workPhones: {
                        phone: $.trim(this.$el.find("#phone").val()),
                        mobile: $.trim(this.$el.find("#mobile").val())
                    },
                    degree: this.$el.find("#degreesDd option:selected").val(),
                    relatedUser:relatedUser,
                    nextAction: nextAction,
                    source: {
                        id: this.$el.find("#sourceDd option:selected").val()
                    },
                    referredBy: $.trim(this.$el.find("#referredBy").val()),
                    department: department,
                    jobPosition: jobPositionId,
                    expectedSalary: $.trim(this.$el.find("#expectedSalary").val()),
                    proposedSalary: $.trim(this.$el.find("#proposedSalary").val()),
                    tags: $.trim(this.$el.find("#tags").val()).split(','),
                    otherInfo: this.$el.find("#otherInfo").val(),
                    workflow: this.$el.find("#workflowsDd option:selected").val() ? this.$el.find("#workflowsDd option:selected").val() : null
                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
                        Backbone.history.navigate("easyErp/Applications", { trigger: true });
                        self.hideDialog();
                    },
                    error: function () {
                        Backbone.history.navigate("easyErp", { trigger: true });
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
                                $('.applications-edit-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.applications-edit-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
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
				   $(id).parent().append("<a class='current-selected' href='javascript:;'>"+text+"</a>");
				   $(id).hide();
			   },

    
            render: function () {
                var formString = this.template({ model: this.currentModel.toJSON() });
				var b= this.currentModel.toJSON() ;
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "applications-edit-dialog",
                    width: 690,
                    title: "Edit Application",
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
                common.populateJobPositions(App.ID.jobPositionDd, "/JobPosition", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.jobPositionDd);});
                common.populateWorkflows("Application", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.workflowDd);self.styleSelect(App.ID.workflowNamesDd);});
                common.populateEmployeesDd(App.ID.relatedUsersDd, "/getPersonsForDd", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.relatedUsersDd);});
                common.populateDepartments(App.ID.departmentDd, "/Departments", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.departmentDd);});
                common.populateDegrees(App.ID.degreesDd, "/Degrees", this.currentModel.toJSON(),function(){self.styleSelect(App.ID.degreesDd);});
				   self.styleSelect("#sourceDd");

                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                $('#nextAction').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: new Date()
                });
                return this;
            }

        });
        return EditView;
    });
