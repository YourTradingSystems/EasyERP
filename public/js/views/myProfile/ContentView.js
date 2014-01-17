define([
    "text!templates/myProfile/UsersPagesTemplate.html",
    "text!templates/myProfile/ChangePassword.html",
    "collections/myProfile/UsersCollection",
    'common'
],
    function (UsersPagesTemplate, ChangePassword,UsersCollection, common) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "myProfile",
            actionType:"Content",
            template: _.template(ChangePassword),
            
            initialize: function (options) {
            	this.UsersCollection = new UsersCollection();
                this.UsersCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },
            events:{
            	"click .changePassword":"changePassword",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
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
            	var model = this.UsersCollection.toJSON();
                this.$el.html(_.template(UsersPagesTemplate,
                    { model:model[0],
                        contentType: this.contentType
                    }));
                common.canvasDraw({ model: model[0] }, this);
                return this;
            }
        });

        return ContentView;
    });
