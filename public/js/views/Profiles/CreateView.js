define([
    "text!templates/Profiles/CreateProfileTemplate.html",
    "models/ProfileModel",
    "text!templates/Profiles/ModulesAccessListTemplate.html",
    "common"
],
    function (CreateProfileTemplate, ProfileModel,  ModulesAccessTemplate, common) {
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
                "click #top-bar-nextBtn": "nextForm",
                'click .viewAll': 'toggleView',
                'click .writeAll': 'toggleWrite',
                'click .deleteAll': 'toggleDelete'
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
            filterCollection:function(){
                this.profile = this.profilesCollection.get('5264f88d22be433c0b000003');
                if(!this.profile)
                    throw new Error("No profile found after filter: ModulesTableView -> filterCollection");
            },
            nextForm: function(){
                this.model = new ProfileModel();
                this.model.set({
                   profileName: $('#profileName').val(),
                   profileDescription: $('#profileDescription').val()
                }, {validate:true});
                if(!this.model.isValid())
                    return;

                var stringModel = JSON.stringify(this.model.toJSON());
                window.localStorage.setItem('tempModel', stringModel);

                var choice = $('input[name=group]:checked').val();
                switch(choice){
                    case "new":
                        this.selectedProfile = this.profilesCollection.findWhere({profileName : "No Access"});
                        break;
                    case "base":
                        var profileId = $('#profilesDd option:selected').val();
                        this.selectedProfile = this.profilesCollection.get(profileId);
                        break;
                }

                $('#top-bar-nextBtn').hide();
                $('#top-bar-saveBtn').show();
                this.$el.html(_.template(ModulesAccessTemplate, {profile: this.selectedProfile.toJSON()} ));

            },
            saveItem: function () {
                var self = this;
                var jsonModel = JSON.parse(window.localStorage.getItem('tempModel'));
                window.localStorage.removeItem('tempModel');
                jsonModel.profileAccess = this.selectedProfile.get('profileAccess');
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
                    jsonModel.profileAccess[i].access[0] = readAccess[i];
                    jsonModel.profileAccess[i].access[1] = writeAccess[i];
                    jsonModel.profileAccess[i].access[2] = deleteAccess[i];
                }
                var model = new ProfileModel(jsonModel);
                model.save({},
                    {
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
                this.$el.html(this.template({ profilesCollection: this.getProfilesForDropDown() }));
                return this;
            }
        });

        return CreateView;
    });