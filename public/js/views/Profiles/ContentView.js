define([
    "text!templates/Profiles/ProfileListTemplate.html",
    "views/Profiles/ModulesAccessView",
    'custom',
    'common'
],
    function (ProfileListTemplate, ModulesAccessView, Custom, common) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "Profiles",
            actionType:"Content",
            initialize: function (options) {
                this.profilesCollection = options.collection;
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },
            events:{
                "click .profile": "viewProfile",
                "click .profile-list li": "viewProfileDetails",				
                "click .profile-list li a": "viewProfileDetails",				
                "click .editProfile":"editProfile",
                "click #newProfileBtn": "createProfile"
            },
			viewProfileDetails:function(e){
				e.preventDefault();
				$("#modulesAccessTable").hide();
				var currentLi = $(e.target).closest("li");
				$(currentLi).parent().find(".active").removeClass("active");
				$(currentLi).addClass("active");
				var id = $(currentLi).find("a").data("id");
				this.profileId = id;
                this.profile = this.profilesCollection.get(this.profileId);
				$("#modulesAccessTable").find("tbody").empty();
				var pr = this.profile.toJSON().profileAccess;
				for (var i=0; i<pr.length;i++){
					var c1 = "";
					var c2 = "";
					var c3 = "";
					if (pr[i].access[0]){c1='checked="checked"'}
					if (pr[i].access[1]){c2='checked="checked"'}
					if (pr[i].access[2]){c3='checked="checked"'}
					$("#modulesAccessTable").find("tbody").append('<tr><td class="mname">'+pr[i].module.mname+'</td><td><input type="checkbox" class="read" '+c1+' disabled /></td><td><input type="checkbox" class="write" '+c2+' disabled/></td><td><input type="checkbox" class="delete" '+c3+' disabled/></td></tr>')
				}
				$("#modulesAccessTable").show(150);

				return false;
			},
            editItem: function(){
                $('#saveDiscardHolder').show();
                $('#createBtnHolder').hide();
                var selectedProfile = $('.profile:selected').text().trim();
                if(selectedProfile){
                    this.modulesView = new ModulesAccessView({action:"edit", profileName:selectedProfile, profilesCollection:this.profilesCollection});
                }
                this.modulesView.render();
            },

            saveItem: function(){
                var selectedProfile = $('.profile:selected').text().trim();
                var profile = this.profilesCollection.findWhere({profileName:selectedProfile});
                var jsonProfile = profile.toJSON();
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

                var self = this;
                var mid = 39;
                profile.set(jsonProfile,{validate:true});
                profile.save({},
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
            viewProfile: function(event){
                var profileName = $(event.target).text().trim();
                if(profileName == "")
                    throw new Error("Profile not selected");
                $('#top-bar-editBtn').show();
//                this.modulesView = new ModulesAccessView({action:"view",profileName:profileName, profilesCollection: this.profilesCollection});
//                this.modulesView.render();
            },
            render: function () {
                this.$el.html(_.template(ProfileListTemplate,
                    { profilesCollection:this.profilesCollection,
                        contentType: this.contentType
                    }));
                return this;
            }
        });

        return ContentView;
    });
