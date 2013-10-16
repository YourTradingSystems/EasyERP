define([
    "text!templates/Users/EditTemplate.html",
    "collections/Companies/CompaniesCollection",
    "collections/Profiles/ProfilesCollection",
    "custom",
    "common"
],
    function (EditTemplate, CompaniesCollection, ProfilesCollection, Custom, common) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Users",
            imageSrc: '',

            initialize: function (options) {
                this.collection = options.collection;
                this.profilesCollection = new ProfilesCollection();
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
            },

            saveItem: function () {
                var itemIndex = Custom.getCurrentII() - 1;
                var self = this;
                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];
                    var mid = 39;
                    var data = {
                        imageSrc: this.imageSrc,
                        email: $('#email').val(),
                        login: $('#login').val(),
                        pass: $('#password').val(),
                        profile: {
                            company: {
                                id: $('#companiesDd option:selected').val(),
                                name: $('#companiesDd option:selected').text()
                            },
                            profile: {
                                id: $('#profilesDd option:selected').val(),
                                name: $('#profilesDd option:selected').text()
                            }
                        }
                    };

                    currentModel.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model, responseText) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        },
                        confirmPass: $('#confirmpassword').val(),
                        editMode: true
                    });

                }
            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;
                var currentModel = this.collection.models[itemIndex];
                if (itemIndex == -1)
                { this.$el.html(); }
                else
                {
                    currentModel.set({ pass: "" });
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(),
                        companiesCollection: this.companiesCollection,
                        profilesCollection: this.profilesCollection
                    }));
                }
                common.canvasDraw({ model: currentModel.toJSON() }, this);
                return this;
            }

        });

        return EditView;
    });