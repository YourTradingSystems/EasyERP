define([
    "text!templates/Users/CreateTemplate.html",
    "models/UsersModel",
    "common"
],
    function (CreateTemplate, UsersModel, common) {

        var UsersCreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Users",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new UsersModel();
                this.render();
            },

            events: {
                "submit form": "submit",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
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
            saveItem: function () {
                var self = this;
                var mid = 39;
                this.model.save({
                    imageSrc: this.imageSrc,
                    email: $('#email').val(),
                    login: $('#login').val(),
                    pass: $('#password').val(),
                    profile: $('#profilesDd option:selected').val()
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    },
                    confirmPass: $('#confirmpassword').val()
                });

            },
            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: "50%",
                    title: "Create User",
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
                common.populateProfilesDd(App.ID.profilesDd, "/Profiles");
                common.canvasDraw({ model: this.model.toJSON() }, this);
                return this;
            }
        });

        return UsersCreateView;
    });
