define([
    "text!templates/UsersPages/UsersPagesTemplate.html",
    "text!templates/UsersPages/ChangePassword.html",
    'common'
],
    function (UsersPagesTemplate, ChangePassword, common) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "UserPages",
            actionType:"Content",
            template: _.template(ChangePassword),
            initialize: function (options) {
                this.usersCollection = options.collection;
                this.usersCollection.bind('add', _.bind(this.render, this));
                this.usersCollection.bind('reset', _.bind(this.render, this));
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
                    { usersCollection:this.usersCollection.toJSON(),
                        contentType: this.contentType
                    }));
                console.log(this.usersCollection.toJSON());
                return this;
            }
        });

        return ContentView;
    });
