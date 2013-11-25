define(function () {
        var CalendarModel = Backbone.Model.extend({
            idAttribute: "id",
            initialize: function(){

            },
            defaults:{
               eventType: 'call'
            },
            urlRoot: "/Calendars"
        });

        return CalendarModel;
    });