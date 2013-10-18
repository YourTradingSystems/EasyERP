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
            	"click #top-bar-deleteBtn": "deleteEvent",
            	"click #top-bar-saveBtn": "saveEvent",
            	"click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-editBtn" : "editEvent"
            },
            editEvent: function(event)
            {
                event.preventDefault();
                this.trigger('editEvent');
            },
            saveEvent: function(event)
            {
                event.preventDefault();
                this.trigger('saveEvent');
            },
            deleteEvent: function(event)
            {
                event.preventDefault();
                var answer=confirm("Realy DELETE items ?!");
                if (answer==true) this.trigger('deleteEvent');
            },
            discardEvent: function(event)
            {
                event.preventDefault();
                Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
            },
            
            initialize: function(options){
                this.actionType = options.actionType;
                this.render();
            },

            render: function(){
                this.$el.html(this.template({contentType: this.contentType}));
                if (this.actionType == "Content")
                {
                    $("#createBtnHolder").show();
                    $("#saveDiscardHolder").hide();
                }else
                {
                    $("#createBtnHolder").hide();
                    $("#saveDiscardHolder").show();
                }
                $("#top-bar-editBtn").hide();
                $("#top-bar-deleteBtn").hide();
                return this;
            }
        });

        return TopBarView;
    });