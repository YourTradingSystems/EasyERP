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
            	"click .changePassword":"changePassword"
            },
            
            changePassword: function (e){
            	e.preventDefault();                
            	var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
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

            render: function () {
            	
                this.$el.html(_.template(UsersPagesTemplate,
                    { myProfileModel:this.UsersCollection,
                        contentType: this.contentType
                    }));
                console.log(this.UsersCollection.toJSON());
                return this;
            }
        });

        return ContentView;
    });
