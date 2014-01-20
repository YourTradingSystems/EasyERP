define([
    "text!templates/myProfile/UsersPagesTemplate.html",
    "text!templates/myProfile/ChangePassword.html",
    "collections/myProfile/UsersCollection",
    'common',
    'dataService'
],
    function (UsersPagesTemplate, ChangePassword, UsersCollection, common, dataService) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "myProfile",
            actionType:"Content",
            template: _.template(ChangePassword),
            imageSrc: '',
            initialize: function (options) {
            	
            	this.startTime = options.startTime;
            	this.UsersCollection = new UsersCollection();
                this.UsersCollection.bind('reset', _.bind(this.render, this));
                
            },
            events:{
            	"click .changePassword":"changePassword",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click #resetBtn":"resetForm",
                "click #saveBtn":"save",
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
                            click: self.saveItem
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
            
            save: function (e){
            	e.preventDefault();                
            	var username = $.trim($("#login").val());
            	var email = $.trim($("#email").val());
            	var imageSrc = this.imageSrc;
            	console.log(imageSrc);
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
            render: function () {
            	var model = this.UsersCollection.toJSON()[0];
                this.$el.html(_.template(UsersPagesTemplate,
                    { model:model,
                        contentType: this.contentType
                    }));
                common.canvasDraw({ model: model }, this);
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
                return this;
            }
        });

        return ContentView;
    });
