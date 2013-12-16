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
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.render();
            },
            hideDialog: function () {3
                $(".edit-dialog").remove();
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

            render: function () {
                var formString = this.template(this.currentModel.toJSON());
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 600,
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
                        }
                    }
                });
				var p=this.currentModel.toJSON()
                common.populateProfilesDd(App.ID.profilesDd, "/Profiles", this.currentModel.toJSON());
                common.canvasDraw({ model: this.model.toJSON() }, this);
                return this;
            }

        });

        return EditView;
    });
