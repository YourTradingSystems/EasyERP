define([
        'text!templates/main/MainTemplate.html',
        'views/menu/LeftMenuView',
        'collections/menu/MenuItems',
        'views/menu/TopMenuView',
    ], function(MainTemplate, LeftMenuView, MenuItemsCollection, TopMenuView) {

        var MainView = Backbone.View.extend({
            el: '#wrapper',
            
            events: {
                'click #loginPanel': 'showSelect',
                'click': 'hideProp',
            },
            
            initialize: function(options) {
				this.contentType = options?options.contentType:null;
                this.render();
                this.collection = new MenuItemsCollection();
                this.collection.bind('reset', this.createMenuViews, this);
            },
			hideProp:function(e){
				if ($(e.target).closest("#loginPanel").length==0){
					var select = this.$el.find('#loginSelect');
					select.hide();
					select.prop('hidden', true);
				}
			},
            createMenuViews: function() {
				var currentRoot = null;
				var currentChildren = null;
				if (this.contentType){
					console.log(this.contentType);
					currentChildren = this.collection.where({href:this.contentType});
					console.log(currentChildren);
					var currentRootId = currentChildren[0].get("parrent");
					currentRoot = this.collection.where({_id:currentRootId});
					console.log(currentRoot);
				}
                this.leftMenu = new LeftMenuView({ collection: this.collection, currentChildren:currentChildren,currentRoot: currentRoot });
                this.topMenu = new TopMenuView({ collection: this.collection.getRootElements(),currentRoot: currentRoot, leftMenu: this.leftMenu });
                this.topMenu.bind('changeSelection', this.leftMenu.setCurrentSection, { leftMenu: this.leftMenu });
                this.topMenu.bind('mouseOver', this.leftMenu.mouseOver, { leftMenu: this.leftMenu });
            },
            showSelect: function(e) {
                var select = this.$el.find('#loginSelect');
                if (select.prop('hidden')) {
                    select.show();
                    select.prop('hidden', false);
                } else {
                    select.hide();
                    select.prop('hidden', true);
                }
            },
            render: function() {
                console.log('Render Main View');
                this.$el.html(MainTemplate);

                return this;
            }
        });

        return MainView;

    });
