define([
    "text!templates/myProfile/UsersPagesTemplate.html",
    "text!templates/myProfile/ChangePassword.html",
    'common'
],
    function (UsersPagesTemplate, ChangePassword,UsersCollection, common) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "myProfile",
            actionType:"Content",
            template: _.template(ChangePassword),
            
            initialize: function (options) {
                this.collection = options.collection;
                //this.collection.bind('reset', _.bind(this.render, this));
                //console.log(this.collection.models);
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
            	var collection = this.collection.toJSON();
                this.$el.html(_.template(UsersPagesTemplate,
                    { myProfileModel:this.UsersCollection,
                        contentType: this.contentType
                    }));
                console.log(this.collection.models);
                return this;
            }
        });

        return ContentView;
    });
