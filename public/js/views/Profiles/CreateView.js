define([
    "text!templates/Profiles/CreateProfileTemplate.html",
    "models/ProfilesModel",
    "text!templates/Profiles/ModulesAccessListTemplate.html",
    "common",
    "populate"
],
    function (CreateProfileTemplate, ProfilesModel,  ModulesAccessTemplate, common, populate) {
        var CreateView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "Profiles",
            template: _.template(CreateProfileTemplate),
            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new ProfilesModel();
                this.profilesCollection = options.collection;
                this.responseObj = {};
                this.render();
            },
            events:{
                'click .viewAll': 'toggleView',
                'click .writeAll': 'toggleWrite',
                'click .deleteAll': 'toggleDelete',
                'keydown': 'keydownHandler',
				"click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect"
            },
            notHide: function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
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
                        var profileId = $('#profilesDd').data("id");
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
                    error: function (model, xhr) {
    					self.errorNotification(xhr);
                    }
				});

            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },
            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    width: 600,
                    title: "Create Profile",
                    buttons: {
                      save: {
                            text: "Create",
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
				populate.get("#profilesDd", "ProfilesForDd", {}, "profileName", this, true);
                this.delegateEvents(this.events);
                //this.$el.html(this.template({ profilesCollection: this.getProfilesForDropDown() }));
                return this;
            }
        });

        return CreateView;
    });
