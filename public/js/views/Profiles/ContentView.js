define([
    "text!templates/Profiles/ProfileListTemplate.html",
    "views/Profiles/ModulesAccessView",
    'custom'
],
    function (ProfileListTemplate, ModulesAccessView, Custom) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.profilesCollection = options.collection;
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },
            events:{
                "click .profile": "viewProfile",
                "click .editProfile":"editProfile",
                "click #newProfileBtn": "createProfile"
            },

            editItem: function(){

            },

            viewProfile: function(event){
                var profileName = $(event.target).text().trim();
                if(profileName == "")
                    throw new Error("Profile not selected");
                $('#top-bar-editBtn').show();
                this.modulesView = new ModulesAccessView({action:"view",profileName:profileName, profilesCollection: this.profilesCollection});
                this.modulesView.render();
            },
            render: function () {
                var viewType = Custom.getCurrentVT();
                this.$el.html(_.template(ProfileListTemplate,
                    { profilesCollection:this.profilesCollection
                    }));
                return this;
            }
        });

        return ContentView;
    });