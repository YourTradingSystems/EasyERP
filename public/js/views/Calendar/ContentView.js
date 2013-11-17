define([
    "text!templates/Calendar/CalendarTemplate.html",
    "Calendar",
    "collections/Events/EventsCollection",
    "common" ,
    "GoogleAuth"
],
function (CalendarTemplate, Calendar, EventsCollection, common, GoogleAuth) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(CalendarTemplate),
        initialize: function () {
            this.eventsCollection = new EventsCollection();
            this.eventsCollection.bind('reset', _.bind(this.render, this));
            //this.render();
        },

        events: {
            "click #authBtn" : "authorize"
        },
        authorize: function(){
            GoogleAuth.Authorize(this.getCalendarEvents);
        },

        getCalendarEvents: function(resp){
            console.log('getCalendarEvents');
            GoogleAuth.getCalendarEvents();
        },

        render: function () {
            console.log('Render Calendar');
            this.$el.html(this.template());
            Calendar.initCalendar("schedulerDiv", this.eventsCollection);
            Calendar.initMiniCalendar("miniCalendar");
            return this;
        }
    });

    return ContentView;
});
