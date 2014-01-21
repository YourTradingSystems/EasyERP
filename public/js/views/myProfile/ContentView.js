define([
    "text!templates/myProfile/UsersPagesTemplate.html",
    "text!templates/myProfile/ChangePassword.html",
    'common',
    'dataService'
],
    function (UsersPagesTemplate, ChangePassword, common, dataService) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "myProfile",
            actionType:"Content",
            template: _.template(ChangePassword),
            imageSrc: '',
            initialize: function (options) {       	
            	this.startTime = options.startTime;
            	this.render();
            },
            events:{
            	"click .changePassword":"changePassword",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click #resetBtn":"resetForm",
                "click #saveBtn":"save",
                "click #RelatedEmployee li > a": "gotoEmployeesForm"
            },
            
            changePassword: function (e){
            	e.preventDefault();                
            	var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "change-password-dialog",
                    width: "80%",
                    title: "Change Password",
                    buttons:{
                        save:{
                            text:"Save",
                            class:"btn",
                            click: self.ChangePassword
                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });
            },
            
            ChangePassword: function (e){
            	e.preventDefault();
                dataService.postData('/currentUser', {
              	  	oldpass:$.trim($('#old_password').val()),
              	  	pass: $.trim($('#new_password').val()),
              	  	confirmPass: $.trim($('#confirm_new_password').val())
              },
              
              function (seccess, error) {
                  if (seccess) {
                      Backbone.history.fragment = '';
                      Backbone.history.navigate("easyErp/myProfile", { trigger: true });
                  }
              });
            },
            
            save: function (e){
            	e.preventDefault();
                dataService.postData('/currentUser', {
                	  imageSrc: imageSrc,
                      email: $.trim($("#email").val()),
                      login: $.trim($("#login").val()),
                      RelatedEmployee:$("input[type='radio']:checked").attr("data-id")
                },
                
                function (seccess, error) {
                    if (seccess) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate("easyErp/myProfile", { trigger: true });
                    }
                });
                
            },
            
            resetForm: function (e){
            	e.preventDefault();                
            	$(':input','#createUserForm')
            	 .not(':button, :submit, :reset, :hidden')
            	 .val('')
            	 .removeAttr('checked')
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
            
            hideDialog: function () {
                $(".change-password-dialog").remove();
            },
            
            gotoEmployeesForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#easyErp/Employees/form/" + itemIndex;
            },
            
            render: function () {
                dataService.getData('/currentUser', null, function (response, context) {
                	dataService.getData('/getForDdByRelatedUser', null, function (RelatedEmployee){

                		var date =  new Date();
                		var minutes = date.getTimezoneOffset();
                		if (minutes < 0)
                			var timezone = ("UTC " +  minutes / 60);
                		else
                			var timezone = ("UTC " + minutes / 60);
                		var model = response;
	                	context.$el.html(_.template(UsersPagesTemplate,
	                            { model:model,
	                			 RelatedEmployee:RelatedEmployee.data,
	                			 timezone:timezone
	                            }));
	                        common.canvasDraw({ model: model }, this);
	                     
	                       if(response.RelatedEmployee){
	                        	$("input[type='radio'][value="+response.RelatedEmployee+"]").attr("checked",true);
	                        }
	                       else {
	                    	   $("input[type='radio']:first").attr("checked",true);
	                       }
	                        context.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-context.startTime)+" ms</div>");
                	},this);
        		},this);
                
                return this;
            }
        });

        return ContentView;
    });
