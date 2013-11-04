define([
    "text!templates/Calendar/CalendarTemplate.html",
    "Calendar",
    "collections/Events/EventsCollection",
    "common"
],
function (CalendarTemplate, Calendar, EventsCollection, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(CalendarTemplate),
        initialize: function () {
            this.eventsCollection = new EventsCollection();
            this.eventsCollection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: { },

        render: function () {
            this.$el.html(this.template());
            Calendar.initCalendar("schedulerDiv", this.eventsCollection);
            Calendar.initMiniCalendar("miniCalendar");
            return this;
        }
    });

    return ContentView;
});
