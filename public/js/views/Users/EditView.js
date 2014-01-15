define([
    "text!templates/Users/EditTemplate.html",
    "custom",
    "common",
    "dataService"
],
    function (EditTemplate, Custom, common,dataService) {
        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Users",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },
            hideDialog: function () {3
                $(".edit-dialog").remove();
            },
            

            events: {
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit"
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
                var data = {
                    imageSrc: this.imageSrc,
                    email: $('#email').val(),
                    login: $('#login').val(),
                    profile: $('#profilesDd option:selected').val()
                };

                this.currentModel.save(data, {
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
                    confirmPass: $('#confirmpassword').val(),
                    editMode: true
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
                                $('.edit-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function () {
                                $('.edit-dialog').remove();
                                Backbone.history.navigate("home", { trigger: true });
                            }
                        });
                }
            },

            render: function () {
                var formString = this.template(this.currentModel.toJSON());
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: "Edit User",
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
                        },
                        delete:{
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
				var p=this.currentModel.toJSON()
                common.populateProfilesDd(App.ID.profilesDd, "/ProfilesForDd", this.currentModel.toJSON());
                common.canvasDraw({ model: this.model.toJSON() }, this);
                return this;
            }

        });

        return EditView;
    });
