define([
    'text!templates/Profiles/TopBarTemplate.html',
    'custom'
],
    function (TopBarTemplate, Custom) {
        var TopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Profiles",
            actionType: null, //Content, Edit, Create
            template: _.template(TopBarTemplate),
            
            events:{
            	"click a.changeContentView": 'changeContentViewType',
            	"click ul.changeContentIndex a": 'changeItemIndex',
            	"click #top-bar-deleteBtn": "deleteEvent",
            	"click #top-bar-saveBtn": "saveEvent",
            	"click #top-bar-discardBtn": "discardEvent"
            },
            
            initialize: function(options){
                this.render();
            },

            render: function(){
                this.$el.html(this.template({contentType: this.contentType}));
                return this;
            }
        });

        return TopBarView;
    });