define([
    "text!templates/Profiles/ViewTemplate.html"
],
    function (ViewTemplate) {
        var ViewView = Backbone.View.extend({
            el: '#content-holder',
            template: _.template(ViewTemplate),
            contentType: "Profiles",
            initialize: function (options) {
                this.profilesCollection = options.collection;
                this.profilesCollection.bind("reset", _.bind(this.render, this));
                this.render();
            },
            deleteItem: function(){
                var id  = this.getIdFromHash(window.location.hash);
                var modeltoDelete = this.profilesCollection.get(id);
                if(modeltoDelete){
                    modeltoDelete.destroy({
                        headers: {
                            mid: 39
                        },
                        wait: true
                    });
                }
                this.collection.trigger('reset');
                Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
            },
            getIdFromHash: function(hash){
                var hashItems = hash.split('/');
                return hashItems[hashItems.length - 1];
            },
            render: function () {
                this.profileId = this.getIdFromHash(window.location.hash);
                this.profile = this.profilesCollection.get(this.profileId);
                this.$el.html(this.template({
                                    profile: this.profile.toJSON(),
                                    profileName: this.profile.get("profileName"),
                                    profileDescription: this.profile.get("profileDescription")
                }));


                return this;
            }

        });

        return ViewView;
    });