define([
],
    function () {
        var EventModel = Backbone.Model.extend({
            //idAttribute: "_id",
            initialize: function(){
            },
            defaults:{
                //  id:null,
                /*eventType: "",
                subject: "New Event",
                description: "New Event",
                start_date: null,
                end_date: null,*/
                //status:"notStarted",
                //assignTo:""
            },
            urlRoot: "/Events"
        });

        return EventModel;
    });