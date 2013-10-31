define([
    'text!templates/Users/TopBarTemplate.html',
    'custom'
],
    function (TopBarTemplate, Custom) {
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
                "click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-createBtn" : "createEvent"
            },


            
            changeContentViewType: Custom.changeContentViewType,
            
            changeItemIndex: Custom.changeItemIndex,
            
            initialize: function(options){
                this.actionType = options.actionType;
                if (this.actionType !== "Content")
                    Custom.setCurrentVT("form");
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render();
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
                if(this.actionType == "Content"){
                    $('#createBtnHolder').show();
                    $('#saveDiscardHolder').hide();
                } else{
                    $('#createBtnHolder').hide();
                    $('#saveDiscardHolder').show();
                }
                $("ul.changeContentIndex").hide();
                $("#top-bar-editBtn").hide();
                $("#top-bar-deleteBtn").hide();

                if ((viewType == "form") && (this.actionType === "Content")) {
                    $("ul.changeContentIndex").show();
                    $("#top-bar-editBtn").show();
                    $("#top-bar-deleteBtn").show();
                    $("#template-switcher>span").show();
                } else
                if ((viewType == "form") && (this.actionType === "Edit")) {
                    $("ul.changeContentIndex").show();
                    $("#template-switcher>span").show();
                }
               
                return this;
            },

            saveEvent:function(event){
                event.preventDefault();
                this.trigger('saveEvent');
            },
            discardEvent: function (event) {
                event.preventDefault();
                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
            }

        });



        return TopBarView;
    });