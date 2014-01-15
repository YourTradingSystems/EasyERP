define([
    "text!templates/Profiles/CreateProfileTemplate.html",
    "models/ProfilesModel",
    "text!templates/Profiles/ModulesAccessListTemplate.html",
    "common"
],
    function (CreateProfileTemplate, ProfilesModel,  ModulesAccessTemplate, common) {
        var CreateView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "Profiles",
            template: _.template(CreateProfileTemplate),
            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new ProfilesModel();
                this.profilesCollection = options.collection;
                this.render();
            },
            events:{
                'click .viewAll': 'toggleView',
                'click .writeAll': 'toggleWrite',
                'click .deleteAll': 'toggleDelete',
                'keydown': 'keydownHandler'
            },

            keydownHandler: function(e){
                switch (e.which){
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
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
            saveItem: function(){
                var choice = $('input[name=group]:checked').val();
                switch(choice){
                    case "new":
                        this.selectedProfile = this.profilesCollection.findWhere({profileName:"baned"});
                        break;
                    case "base":
                        var profileId = $('#profilesDd option:selected').val();
                        this.selectedProfile = this.profilesCollection.get(profileId);
                        break;
                }
                if(!this.selectedProfile)
                    throw new Error('Base profile is undefined');

                var self = this;

				this.model.save({
                    profileName: $.trim(this.$el.find('#profileName').val()),
                    profileDescription: $.trim(this.$el.find('#profileDescription').val()),
                    profileAccess: this.selectedProfile.get('profileAccess')
                },{
					headers:{
						mid:39
					},
					wait:true,
					success:function(models, response, options){
						self.hideDialog();
						Backbone.history.navigate("easyErp/Profiles", { trigger: true });
						response.data.profileAccess=models.toJSON().profileAccess;
						self.profilesCollection.set(response.data, { remove: false });
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



            /*saveItem: function () {
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
                var model = new ProfilesModel(jsonModel);
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
            },*/
            hideDialog: function () {
                $(".edit-dialog").remove();
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
                var formString = this.template({profilesCollection:this.getProfilesForDropDown()});
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 600,
                    title: "Create Profile",
                    buttons: {
                       /* next: {
                            text: "Next",
                            class: "btn",
                            id: "nextBtn",
                            click: self.nextForm
                        },*/
                        save: {
                            text: "Save",
                            id: "saveBtn",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }

                    }
                });
                //$('#saveBtn').hide();
                this.delegateEvents(this.events);
                //this.$el.html(this.template({ profilesCollection: this.getProfilesForDropDown() }));
                return this;
            }
        });

        return CreateView;
    });
