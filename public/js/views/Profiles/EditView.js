define([
    "text!templates/Profiles/EditTemplate.html"
],
    function (EditTemplate) {
        var EditView = Backbone.View.extend({
            el: "#content-holder",
            template: _.template(EditTemplate),
            contentType: "Profiles",
            initialize: function (options) {
                this.profilesCollection = options.collection;
                this.profilesCollection.bind("reset", _.bind(this.render, this));
                this.render();
            },
            events:{
                'click .viewAll': 'toggleView',
                'click .writeAll': 'toggleWrite',
                'click .deleteAll': 'toggleDelete'
            },

            saveItem: function(){
                var self = this;
                var jsonProfile = this.profile.toJSON();
                var profileName = $('#profileName').val();
                var profileDescription = $('#profileDescription').val();
                jsonProfile.profileName  = profileName;
                jsonProfile.profileDescription = profileDescription;
                var tableContent = $('#modulesAccessTable tbody');
                var readAccess = tableContent.find('input.read:checkbox').map(function(){
                    return this.checked;
                }).get();
                var writeAccess = tableContent.find('input.write:checkbox').map(function(){
                    return this.checked;
                }).get();
                var deleteAccess = tableContent.find('input.delete:checkbox').map(function(){
                    return this.checked;
                }).get();
                for(var i= 0, len = readAccess.length; i < len; i++){
                    jsonProfile.profileAccess[i].access[0] = readAccess[i];
                    jsonProfile.profileAccess[i].access[1] = writeAccess[i];
                    jsonProfile.profileAccess[i].access[2] = deleteAccess[i];
                }

                this.profile.save(jsonProfile, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function () {
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function (model, xhr, options) {
                        if (xhr && xhr.status === 401) {
                            Backbone.history.navigate("login", { trigger: true });
                        } else {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    }
                });
            },
            toggleView: function(){
                var checked = $('.viewAll')[0].checked;
                var checkboxes = $('.read');
                checkboxes.prop('checked', checked);
            },
            toggleWrite: function(){
                var checked = $('.writeAll')[0].checked;
                var checkboxes = $('.write');
                checkboxes.prop('checked', checked);
            },
            toggleDelete: function(){
                var checked = $('.deleteAll')[0].checked;
                var checkboxes = $('.delete');
                checkboxes.prop('checked', checked);
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
                    profileDescription: this.profile.get("profileDescription")}));
                return this;
            }

        });

        return EditView;
    });