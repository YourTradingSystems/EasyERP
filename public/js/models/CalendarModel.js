define(function () {
        var CalendarModel = Backbone.Model.extend({
            idAttribute: "id",
            initialize: function(){

            },

            urlRoot: "/Calendars"
        });

        return CalendarModel;
    });