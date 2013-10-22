define([
    "text!templates/Profiles/ModulesAccessListTemplate.html",
    'common'
],
    function (ModulesAccessTemplate, common) {
        var ViewName = Backbone.View.extend({
            el: "#modulesContent",
            template: _.template(ModulesAccessTemplate),
            initialize: function (options) {
                this.action = options.action;
                this.profilesCollection = options.profilesCollection;
                this.selectedProfile = options.profileName;
                this.render();
            },
            filterCollection:function(){
                this.profile = this.profilesCollection.findWhere({profileName:this.selectedProfile});
                if(!this.profile)
                    throw new Error("No profile found after filter: ModulesTableView -> filterCollection");
            },
            render: function () {
                this.filterCollection();
                this.$el.html(this.template({ profile: this.profile, action: this.action }));
                common.contentHolderHeightFixer();
                return this;
            }

        });

        return ViewName;
    });