define([
    "text!templates/Applications/CreateTemplate.html",
    "models/ApplicationsModel",
    "common"
],
    function (CreateTemplate, ApplicationModel, common) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new ApplicationModel();
                this.render();
            },
            events: {
                "click #tabList a": "switchTab",
                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideNewSelect",
                "change .inputAttach": "addAttach",
				"click .deleteAttach":"deleteAttach"
            },
			deleteAttach:function(e){
				$(e.target).closest(".attachFile").remove();
			},
            addAttach: function (event) {
				var s= $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length-1];
				$(".attachContainer").append('<li class="attachFile">'+
											 '<a href="javascript:;">'+s+'</a>'+
											 '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
											 );
				$(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden","hidden"));
				$(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
			},
            hideDialog: function () {
                $(".edit-dialog").remove();
            },
            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
                //$("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
            },

            isEmployee: function (e) {
                $(e.target).addClass("pressed");
                this.saveItem();
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
            fileSizeIsAcceptable: function(file){
                if(!file){return false;}
                return file.size < App.File.MAXSIZE;
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var isEmployee = false;
                if (this.$("#hire>span").hasClass("pressed")) {
                    isEmployee = true;
                    self.contentType = "Employees";
                }
                //var subject = $.trim($("#subject").val());
                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var name = {
                    first: first,
                    last: last
                };
                var wemail = $.trim($("#wemail").val());
                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var wphones = {
                    phone: phone,
                    mobile: mobile
                };

                var workflow = $("#workflowsDd option:selected").data("id");
                var relatedUserId = $("#relatedUsersDd option:selected").val();
                var nextAction = $.trim($("#nextAction").val());
                /*var nextAction = "";
                if (nextActionSt) {
                    nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                }*/
                var sourceId = $("#source option:selected").val();
                var referredBy = $.trim($("#referredBy").val());
                var departmentId = $("#departmentDd option:selected").val();

                var jobPositionId = $("#jobPositionDd option:selected").val();

                var expectedSalary = $.trim($("#expectedSalary").val());
                var proposedSalary = $.trim($("#proposedSalary").val());
                var tags = $.trim($("#tags").val()).split(',');
                var otherInfo = $("#otherInfo").val();

                this.model.save({
                    isEmployee: isEmployee,
                    //subject: subject,
                    imageSrc: this.imageSrc,
                    name: name,
                    workEmail: wemail,
                    workPhones: wphones,
                    relatedUser: relatedUserId,
                    nextAction: nextAction,
                    source: sourceId,
                    referredBy: referredBy,
                    department: departmentId,
                    jobPosition: jobPositionId,
                    expectedSalary: expectedSalary,
                    proposedSalary: proposedSalary,
                    tags: tags,
                    otherInfo: otherInfo,
                    workflow: workflow
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model) {
						var currentModel = model.changed.result;
						var currentModelID = currentModel["_id"];
						var addFrmAttach = $("#createApplicationForm");
						var fileArr= [];
						var addInptAttach = '';
						$("li .inputAttach").each(function(){
							addInptAttach = $(this)[0].files[0];
							fileArr.push(addInptAttach);
							if(!self.fileSizeIsAcceptable(addInptAttach)){
								alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
								return;
							}
						});
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
												   data: [fileArr],

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
										console.log('Attach file');
										addFrmAttach[0].reset();
										status.hide();
										self.hideDialog();
										Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
									},

									error: function () {
										console.log("Attach file error");
									}
								});
							});
						if(fileArr.length>0){
							addFrmAttach.submit();
						}
						else{
							self.hideDialog();
							Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });

						}
						addFrmAttach.off('submit');

                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
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
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog create-app-dialog",
                    width: 690,
                    title: "Create Application",
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
                        }
                    }
                });
                common.populateWorkflows("Application", App.ID.workflowDd, App.ID.workflowNamesDd, "/Workflows",null,function(){self.styleSelect(App.ID.workflowDd);self.styleSelect(App.ID.workflowNamesDd);});
                common.populateEmployeesDd(App.ID.relatedUsersDd, "/getForDdByRelatedUser", null, function () { self.styleSelect(App.ID.relatedUsersDd); });
//                common.populateSourceApplicants(App.ID.sourceDd, "/SourcesOfApplicants");
                common.populateDepartments(App.ID.departmentDd, "/Departments",null,function(){self.styleSelect(App.ID.departmentDd);});
                common.populateDegrees(App.ID.degreesDd, "/Degrees",null,function(){self.styleSelect(App.ID.degreesDd);});
                common.populateJobPositions(App.ID.jobPositionDd, "/JobPosition",null,function(){self.styleSelect(App.ID.jobPositionDd);});
				self.styleSelect(App.ID.jobPositionDd);
				self.styleSelect("#sourceDd");
                common.canvasDraw({ model: this.model.toJSON() }, this);
                $('#nextAction').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: new Date()
                });
                return this;
            }

        });

        return CreateView;
    });
