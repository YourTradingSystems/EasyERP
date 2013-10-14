define([
],
    function () {
        var EventModel = Backbone.Model.extend({
            //idAttribute: "_id",
            initialize: function(){
            },
            defaults:{
            },
            urlRoot: "/Events"
        });

        return EventModel;
    });