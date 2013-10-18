define([
    "text!templates/Profiles/CreateProfileTemplate.html",
    "models/ProfileModel",
    "collections/Users/UsersCollection"
],
    function (CreateProfileTemplate, ProfileModel, UsersCollection) {
        var CreateView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "Profiles",
            template: _.template(CreateProfileTemplate),
            initialize: function (options) {
                this.model = new ProfileModel();
                this.profilesCollection = options.collection;
                this.render();
            },
            events:{
                "submit #createProfileForm": "submitForm"
            },
            saveItem: function () {
                var self = this;
                var mid = 39;


                this.model.save({
                    profileName: $('#profileNameInput').val(),
                    profileDescription: $('#profileDescInput').val()
                },{
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function () {
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });

            },

            getProfilesForDropDown: function(){
                var arr = this.profilesCollection.toJSON().map(function(item){
                    return {
                        id: item.id || item._id,
                        name: item.profileName
                    }
                });
                return arr;
            },
            render: function () {
                this.$el.html(this.template({profilesCollection: this.getProfilesForDropDown()}));
                return this;
            }
        });

        return CreateView;
    });