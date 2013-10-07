define([
    'text!templates/Users/TopBarTemplate.html',
    'collections/Users/UsersCollection',
    'custom'
],
    function (TopBarTemplate, UsersCollection, Custom) {
        var TopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Users",
            collectionLength: 0,
            template: _.template(TopBarTemplate),
            
            events:{
            	"click a.changeContentView": 'changeContentViewType',
            	"click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-saveBtn": "saveEvent",
                "click #top-bar-discardBtn": "discardEvent"
            },
            
            changeContentViewType: Custom.changeContentViewType,
            
            changeItemIndex: Custom.changeItemIndex,
            
            initialize: function(options){
                this.actionType = options.actionType;
                if (this.actionType !== "Content")
                    Custom.setCurrentVT("form");
                this.collection = new UsersCollection();
                this.collection.bind('reset', _.bind(this.render, this));
                //this.render();
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) this.trigger('deleteEvent');
            },

            render: function(){
                var viewType = Custom.getCurrentVT();
                var collectionLength = this.collection.length;
                var itemIndex = Custom.getCurrentII();
                this.$el.html(this.template({ viewType: viewType, collectionLength: collectionLength, itemIndex: itemIndex }));
                
                (viewType == "form") ? $("ul.changeContentIndex").show() && $("#top-bar-editBtn").show() && $("#template-switcher>span").show() 
                						  : $("ul.changeContentIndex").hide() && $("#top-bar-editBtn").hide();
               
                return this;
            },
            discardEvent: function (event) {
                event.preventDefault();
                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
            }

        });



        return TopBarView;
    });